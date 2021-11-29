using TatraRidges.Model.Exceptions;

namespace TatraRidges.Model.Procedures
{
    public class MountainPointsFinder
    {
        private readonly TatraDbContext _dbContext;

        public MountainPointsFinder(TatraDbContext context) => _dbContext = context;
        public MountainPoint GetPointById(int id)
        {
            var point = _dbContext.MountainPoints.FirstOrDefault(p => p.Id == id);
            if (point == null)
            {
                throw new NotFoundException($"Nie ma punktu z Id = {id}");
            }
            return point;
        }
    }
}
