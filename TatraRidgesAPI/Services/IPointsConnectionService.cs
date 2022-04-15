using System.Collections.Generic;
using TatraRidges.Model.Dtos;

namespace TatraRidgesAPI.Services
{
    public interface IPointsConnectionService
    {
        IEnumerable<PointsRidgeDto> GetAllRidges();
        long AddConnectionBetweenPoints(PointsConnectionCreateDto dto);
    }
}