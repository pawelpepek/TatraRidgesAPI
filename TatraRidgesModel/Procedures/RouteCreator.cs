﻿using TatraRidges.Model.Dtos;
using TatraRidges.Model.Interfaces;

namespace TatraRidges.Model.Procedures
{
    public class RouteCreator
    {
        private readonly TatraDbContext _dbContext;
        private readonly IRidgeFinder _ridgeFinder;

        public RouteCreator(TatraDbContext context, IRidgeFinder ridgeFinder)
        {
            _dbContext = context;
            _ridgeFinder = ridgeFinder;
        }

        public (long idRoute, PointsConnection connection) SaveInDbContext(AddRouteDto dto)
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

            var connection = new Connections(_dbContext).GetRidgeForPointsId(dto.PointId1, dto.PointId2);

            var isNewConnection = connection == null;

            if (isNewConnection)
            {
                connection = new PointsConnection() { PointId1 = dto.PointId1, PointId2 = dto.PointId2, Ridge = true };
                new ConnectionCreator(_dbContext, _ridgeFinder).SaveInDbContext(connection);
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

            var adjcetivesPairs = adjectives.Select(a => new DescriptionAdjectivePair()
            {
                AdjectiveId = a.Id,
                RouteId = newRoute.Id
            }).ToList();

            _dbContext.DescriptionAdjectivePairs.AddRange(adjcetivesPairs);

            var additionalDescriptions = dto.AdditionalDescriptions.Select(d => new AdditionalDescription()
            {
                RouteId = newRoute.Id,
                Description = d.Description,
                Warning = d.Warning
            }).ToList();

            _dbContext.AdditionalDescriptions.AddRange(additionalDescriptions);

            _dbContext.SaveChanges();

            return (newRoute.Id, isNewConnection ? connection : null);
        }
    }
}
