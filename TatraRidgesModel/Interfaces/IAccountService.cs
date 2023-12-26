using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Interfaces
{
    public interface IAccountService
    {
        void RegisterUser(RegisteUserDto dto);
        string GenerateJwt(LoginDto dto);
    }
}