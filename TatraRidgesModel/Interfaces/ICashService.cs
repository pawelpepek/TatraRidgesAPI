namespace TatraRidges.Model.Interfaces
{
    public interface ICashService
    {
        List<PointsConnection> GetConnections(TatraDbContext dbContext);
        List<MountainPoint> GetPoints(TatraDbContext dbContext);
        List<Difficulty> GetDifficulties(TatraDbContext dbContext);
        List<DifficultyDetail> GetDifficultyDetails(TatraDbContext dbContext);
        List<Adjective> GetAdjectives(TatraDbContext dbContext);
        void Reset();
    }
}