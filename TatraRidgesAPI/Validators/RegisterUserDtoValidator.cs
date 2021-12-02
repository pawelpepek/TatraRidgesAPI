using FluentValidation;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.Validators
{
    public class RegisterUserDtoValidator : AbstractValidator<RegisteUserDto>
    {
        public RegisterUserDtoValidator(TatraDbContext dbContext)
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Nick)
                .NotEmpty()
                .MinimumLength(4);

            RuleFor(x => x.Password)
                .MinimumLength(6);

            RuleFor(x => x.ConfirmPassword)
                .Equal(e => e.Password);

            RuleFor(x => x.Email)
                .Custom((value, context) =>
                {
                    if (dbContext.Users.Any(u => u.Email != null && u.Email == value))
                    {
                        context.AddFailure("Email", $"Email {value} jest już zarejestrowany w serwisie!");
                    }
                });
        }
    }
}