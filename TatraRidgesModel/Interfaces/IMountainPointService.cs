using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Interfaces
{
    public interface IMountainPointService
    {
        IEnumerable<MountainPointDto> GetAll();
        void Move(int id, PointGPSDto newCoordinate);
        void Delete(int id);
    }
}