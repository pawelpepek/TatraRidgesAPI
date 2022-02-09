using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Procedures
{
    public class RouteCreator
    {
        private readonly TatraDbContext _dbContext;

        public RouteCreator(TatraDbContext context) => _dbContext = context;

        public (long idRoute, PointsConnection connection)  SaveInDbContext(AddRouteDto dto)
        {
            var newRoute = new Route()
            {
                DifficultyId = Convert.ToByte(dto.DifficultyValue),
                Rappeling = dto.Rappeling,
                RouteTime = dto.RouteTime,
                RouteTypeId = dto.RouteType
            };

            var difficultyDetail = _dbContext.DifficultyDetails.First(d => d.Sign == dto.DifficultySign);

            newRoute.DifficultyDetailId = difficultyDetail.Id;

            var adjectives = _dbContext.Adjectives.Where(a => dto.Adjectives.Contains(a.Id))
                                                  .OrderBy(a => a.Id.Substring(1))
                                                  .ThenByDescending(a => a.Rank)
                                                  .GroupBy(a => a.Id.Substring(1))
                                                  .Select(g => g.First())
                                                  .ToList();

            var connection=new Connections(_dbContext).GetRidgeForPointsId(dto.PointId1,dto.PointId2);

            var isNewConnection = connection == null;

            if (isNewConnection)
            {
                connection=new PointsConnection() { PointId1=dto.PointId1, PointId2=dto.PointId2, Ridge=true };
                new ConnectionCreator(_dbContext).SaveInDbContext(connection);
            }

            var newGuideDescription = new GuideDescription()
            {
                GuideId = dto.GuideDescription.GuideId,
                Number = dto.GuideDescription.Number,
                Volume = dto.GuideDescription.Volume,
                Page = dto.GuideDescription.Page
            };

            _dbContext.GuideDescriptions.Add(newGuideDescription);
            _dbContext.SaveChanges();

            newRoute.GuideDescription = newGuideDescription;
            newRoute.PointsConnection = connection;
            newRoute.ConsistentDirection = connection.PointId1 == dto.PointId1;

            _dbContext.Routes.Add(newRoute);
            _dbContext.SaveChanges();

            var adjcetivesPairs = adjectives.Select(a => new DescriptionAdjectivePair() { AdjectiveId = a.Id, RouteId = newRoute.Id })
                                            .ToList();

            _dbContext.DescriptionAdjectivePairs.AddRange(adjcetivesPairs);
            _dbContext.SaveChanges();

            return (newRoute.Id, isNewConnection?connection:null);
        }
    }
}
