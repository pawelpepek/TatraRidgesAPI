using TatraRidges.Model.Dtos;
using TatraRidges.Model.Exceptions;

namespace TatraRidges.Model.Procedures
{
    public class MountainPointsMover
    {
        private readonly TatraDbContext _dbContext;

        public MountainPointsMover(TatraDbContext context) => _dbContext = context;

        public void MovePoint(int pointId, PointGPSDto newCoordinates)
        {
            var validator= new MountainPointValidator(newCoordinates);
            if(validator.IsCoordinatesValid())
            {
                var finder=new MountainPointsFinder(_dbContext);

                var changedPoint = finder.GetPointById(pointId);

                changedPoint.Latitude=newCoordinates.Latitude;
                changedPoint.Longitude=newCoordinates.Longitude;

                _dbContext.SaveChanges();
            }
            else
            {
                throw new InvalidCoordinateException(validator.ErrorMessage());
            }
        }
    }
}
