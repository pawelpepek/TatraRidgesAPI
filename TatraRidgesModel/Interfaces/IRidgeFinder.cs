using TatraRidges.Model.Helpers;

namespace TatraRidges.Model.Interfaces
{
    public interface IRidgeFinder
    {
        List<PointsConnectionWithDirection> FindRidge(int pointFromId, int pointToId);
    }
}