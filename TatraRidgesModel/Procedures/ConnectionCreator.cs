using TatraRidges.Model.Exceptions;
using TatraRidges.Model.Interfaces;

namespace TatraRidges.Model.Procedures
{
    public class ConnectionCreator
    {
        private readonly TatraDbContext _dbContext;
        private readonly IRidgeFinder _ridgeFinder;

        public ConnectionCreator(TatraDbContext context, IRidgeFinder ridgeFinder)
        {
            _dbContext = context;
            _ridgeFinder = ridgeFinder;
        }

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
            var otherRidgeBetweenPoints = _ridgeFinder
                .FindRidge(newConnection.PointId1, newConnection.PointId2);

            if (otherRidgeBetweenPoints.Any())
            {
                throw new CyclicRidgeException();
            }
        }
    }
}
