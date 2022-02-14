using FluentValidation.TestHelper;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidgesAPI.Validators;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Validators
{
    public class RegisterUserDtoValidatorTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private TatraDbContext _dbContext;

        public RegisterUserDtoValidatorTests()
        {
            var builder = new DbContextOptionsBuilder<TatraDbContext>();
            builder.UseInMemoryDatabase("testRegisterUserDtoValidator");

            _dbContext = new TatraDbContext(builder.Options);
            Seed();
        }

        private void Seed()
        {
            var testUsers = new List<User>()
            {
                new User()
                {
                    Email="test2@test.com",
                    Nick="Test1",
                    PasswordHash="yyyyyy",
                },
                new User()
                {
                    Email="test3@test.com",
                    Nick="Test2",
                    PasswordHash="yyyyyy",
                }
            };

            _dbContext.Users.AddRange(testUsers);
            _dbContext.SaveChanges();
        }

        public static IEnumerable<object[]> GetSampleValidData()
        {
            var list = new List<RegisteUserDto>()
            {
                new RegisteUserDto()
                {
                    Email = "test@test.com",
                    Password = "pass123",
                    ConfirmPassword = "pass123",
                    Nick="Test"
                },
                new RegisteUserDto()
                {
                    Email = "test@a.com",
                    Password = "PPPass123",
                    ConfirmPassword = "PPPass123",
                    Nick="Test2"
                },
            };
            return list.Select(q => new object[] { q });
        }

        public static IEnumerable<object[]> GetSampleInvalidData()
        {
            var list = new List<RegisteUserDto>()
            {
                new RegisteUserDto()
                {
                    Password = "pass123",
                    ConfirmPassword = "pass123"
                },
                new RegisteUserDto()
                {
                    Email = "test@test.com",
                    Password = "pass12",
                    ConfirmPassword = "pass123"
                },
                new RegisteUserDto()
                {
                    Email = "test@test.com",
                    Password = "pass123",
                },
                new RegisteUserDto()
                {
                    Email = "test@test.com",
                    ConfirmPassword = "pass123"
                },
                new RegisteUserDto()
                {
                    Email = "test.com",
                    Password = "pass123",
                    ConfirmPassword = "pass123"
                },
                new RegisteUserDto()
                {
                    Email = "test@test",
                    Password = "pa",
                    ConfirmPassword = "pa"
                },
                new RegisteUserDto()
                {
                    Email = "test2@test.com",
                    Password = "pass123",
                    ConfirmPassword = "pass123"
                },
                new RegisteUserDto()
                {
                    Email = "test2@test.com",
                    Password = "pass123xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    ConfirmPassword = "pass123xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                },
            };
            return list.Select(q => new object[] { q });
        }

        [Theory]
        [MemberData(nameof(GetSampleValidData))]
        public void Validate_ForValidModel_ReturnsSuccess(RegisteUserDto model)
        {
            //arrange

            var validator = new RegisterUserDtoValidator(_dbContext);

            //act

            var result = validator.TestValidate(model);

            //assert

            result.ShouldNotHaveAnyValidationErrors();
        }


        [Theory]
        [MemberData(nameof(GetSampleInvalidData))]
        public void Validate_ForInvalidModel_ReturnsFailure(RegisteUserDto model)
        {
            //arrange

            var validator = new RegisterUserDtoValidator(_dbContext);

            //act

            var result = validator.TestValidate(model);

            //assert

            result.ShouldHaveAnyValidationError();
        }
    }
}