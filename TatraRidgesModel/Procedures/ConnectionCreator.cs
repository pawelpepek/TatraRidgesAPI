using TatraRidges.Model.Exceptions;

namespace TatraRidges.Model.Procedures
{
    public class ConnectionCreator
    {
        private readonly TatraDbContext _dbContext;

        public ConnectionCreator(TatraDbContext context) => _dbContext = context;

        public void SaveInDbContext(PointsConnection newConnection)
        {
            var pointFinder = new MountainPointsFinder(_dbContext);

            pointFinder.GetPointById(newConnection.PointId1);
            pointFinder.GetPointById(newConnection.PointId2);

            CheckRidgeMakeCyclicLink(newConnection);

            _dbContext.PointsConnections.Add(newConnection);
            _dbContext.SaveChanges();
        }
        
        private void CheckRidgeMakeCyclicLink(PointsConnection newConnection)
        {
            var ridgeFinder = new RidgeFinder(_dbContext);

            var otherRidgeBetweenPoints = ridgeFinder
                .FindRidge(newConnection.PointId1, newConnection.PointId2);

            if (otherRidgeBetweenPoints.Any())
            {
                throw new CyclicRidgeException();
            }
        }
    }
}
