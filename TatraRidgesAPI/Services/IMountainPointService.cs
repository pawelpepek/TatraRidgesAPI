using System.Collections.Generic;
using TatraRidges.Model.Dtos;

namespace TatraRidgesAPI.Services
{
    public interface IMountainPointService
    {
        IEnumerable<MountainPointDto> GetAll();
        void Move(int id, PointGPSDto newCoordinate);
        void Delete(int id);
    }
}