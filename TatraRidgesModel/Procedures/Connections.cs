using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Procedures
{
    public class Connections
    {
        private readonly TatraDbContext _dbContext;

        public Connections(TatraDbContext context) => _dbContext = context;

        public List<PointsConnection> GetAll(bool onlyRidge)
        {
            var connections = _dbContext.PointsConnections;

            return onlyRidge 
                ? connections.Where(r => r.Ridge)
                             .Include(r=>r.MountainPoint1)
                             .Include(r=>r.MountainPoint2)
                             .ToList() 
                : connections.ToList();
        }
        public PointsConnection GetByIdWithChildren(long id)
        {
            var connection = _dbContext.PointsConnections
                                       .Include(c=>c.Routes)
                                       .ThenInclude(r=>r.RouteType)
                                       .Include(c=>c.Routes)
                                       .ThenInclude(r=>r.Difficulty)
                                       .Include(c=>c.Routes)
                                       .ThenInclude(r=>r.DifficultyDetail)
                                       .Include(c=>c.Routes)
                                       .ThenInclude(c=>c.DescriptionAdjectivePairs)
                                       .FirstOrDefault(c => c.Id == id);

            return connection ?? PointsConnection.Empty();
        }

        public PointsConnection GetConnectionForPointsId(int pointId1, int pointId2)
        {
            var connectionsFromPoint1 = ConnectionForPointId(pointId1,_dbContext.PointsConnections);

            return connectionsFromPoint1==null?null: ConnectionForPointId(pointId2 ,connectionsFromPoint1).FirstOrDefault();
        }
        private static IQueryable<PointsConnection> ConnectionForPointId(int pointId, IQueryable<PointsConnection> connections)
        {
            return connections.Where(c => c.PointId1 == pointId || c.PointId2 == pointId);
        }
    }
}
