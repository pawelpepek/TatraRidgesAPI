namespace TatraRidges.Model.Interfaces
{
    public interface ICashScopeService
    {
        List<PointsConnection> GetConnections();
        List<Difficulty> GetDifficulties();
        List<DifficultyDetail> GetDifficultyDetails();
        List<MountainPoint> GetPoints();
        List<Adjective> GetAdjectives();
        void Reset();
    }
}