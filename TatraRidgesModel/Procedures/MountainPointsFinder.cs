using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Exceptions;

namespace TatraRidges.Model.Procedures
{
    public class MountainPointsFinder
    {
        private readonly TatraDbContext _dbContext;

        public MountainPointsFinder(TatraDbContext context) => _dbContext = context;
        public MountainPoint GetPointById(int id)
        {
            var point = _dbContext.MountainPoints
                .Include(p=>p.PointsConnections1)
                .Include(p=>p.PointsConnections2)
                .FirstOrDefault(p => p.Id == id);
            if (point == null)
            {
                throw new NotFoundException($"Nie ma punktu z Id = {id}");
            }
            return point;
        }
        public void DeletePointById(int id)
        {
            var point = GetPointById(id);
            var connections = new List<PointsConnection>();
            connections.AddRange(point.PointsConnections1);
            connections.AddRange(point.PointsConnections2);

            connections.ForEach(c => _dbContext.PointsConnections.Remove(c));

            _dbContext.MountainPoints.Remove(point);
            _dbContext.SaveChanges();
        }
    }
}
