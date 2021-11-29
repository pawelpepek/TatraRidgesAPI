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
                ? connections.Where(r => r.Ridge).ToList() 
                : connections.ToList();
        }
    }
}
