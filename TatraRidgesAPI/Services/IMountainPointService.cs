using System.Collections.Generic;
using TatraRidges.Model.Dtos;

namespace TatraRidgesAPI.Services
{
    public interface IMountainPointService
    {
        IEnumerable<MountainPointBasicDto> GetAll();
        void Move(int id, PointGPSDto newCoordinate);
    }
}