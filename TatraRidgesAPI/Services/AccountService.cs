using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Exceptions;
using TatraRidges.Model.Interfaces;

namespace TatraRidgesAPI.Services
{
    public class AccountService : IAccountService
    {
        private readonly TatraDbContext _dbContext;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly AuthenticationSettings _authenticationSettings;

        public AccountService
            (TatraDbContext dbContext, IPasswordHasher<User> passwordHasher, AuthenticationSettings authenticationSettings)
        {
            _dbContext = dbContext;
            _passwordHasher = passwordHasher;
            _authenticationSettings = authenticationSettings;
        }

        public string GenerateJwt(LoginDto dto)
        {
            var user = _dbContext.Users
                .Include(u => u.Role)
                .FirstOrDefault(u => u.Email == dto.Email);
            if (user is null)
            {
                throw new BadRequestException("Invalid username or password");
            }
            switch (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password))
            {
                case PasswordVerificationResult.Success:
                    var claims = new List<Claim>()
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name,  user.Nick),
                        new Claim(ClaimTypes.Role, $"{user.Role.Name}"),
                    };


                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));
                    var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);
                    var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer,
                                                     _authenticationSettings.JwtIssuer,
                                                     claims,
                                                     expires: expires,
                                                     signingCredentials: cred);

                    var tokenHandler = new JwtSecurityTokenHandler();
                    return tokenHandler.WriteToken(token);
                case PasswordVerificationResult.Failed:
                default:
                    throw new BadRequestException("Invalid username or password");
            }
        }

        public void RegisterUser(RegisteUserDto dto)
        {
            var newUser = new User()
            {
                Email = dto.Email,
                Nick = dto.Nick,
                RoleId = 1
            };
            newUser.PasswordHash = _passwordHasher.HashPassword(newUser, dto.Password);
            _dbContext.Users.Add(newUser);
            _dbContext.SaveChanges();
        }
    }
}