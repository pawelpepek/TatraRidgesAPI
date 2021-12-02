using TatraRidges.Model.Dtos;

namespace TatraRidgesAPI.Services
{
    public interface IAccountService
    {
        void RegisterUser(RegisteUserDto dto);
        string GenerateJwt(LoginDto dto);
    }
}