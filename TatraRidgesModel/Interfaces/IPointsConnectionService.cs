using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Interfaces
{
    public interface IPointsConnectionService
    {
        IEnumerable<PointsRidgeDto> GetAllRidges();
        long AddConnectionBetweenPoints(PointsConnectionCreateDto dto);
    }
}