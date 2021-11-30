using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;

namespace TatraRidges.Model.Procedures
{
    public static class RouteArranger
    {
        public static List<RidgeWithRoutesDto> GetArrangeRouteDto(List<PointsConnectionWithDirection> ridgeRoute)
        {
            return ridgeRoute.Select(r => GetRidgeWithRoutesDto(r)).ToList();
        }

        private static RidgeWithRoutesDto GetRidgeWithRoutesDto(PointsConnectionWithDirection ridgePart)
        {
            var connection = ridgePart.PointsConnection;

            var point1Id = connection.PointId1;
            var point2Id = connection.PointId2;

            var ridgeRoute = new RidgeWithRoutesDto()
            {
                PointId1 = ridgePart.ConsistDirection ? point1Id : point2Id,
                PointId2 = ridgePart.ConsistDirection ? point2Id : point1Id,

                Routes = connection.Routes.Select(r => GetRouteDto(r, ridgePart.ConsistDirection))
                                          .OrderBy(rt => rt.ConsistentDirection)
                                          .OrderBy(rt => rt.RouteType.Rank)
                                          .OrderByDescending(rt => rt.DifficultyValue)
                                          .OrderByDescending(rt => rt.Rappeling)
                                          .ToList()
            };
            return ridgeRoute;
        }

        private static RouteDto GetRouteDto(Route route, bool consistDirection)
        {
            return new RouteDto()
            {
                Difficulty = route.Difficulty.Text + route.DifficultyDetail.Sign,
                GuideDescriptionId = route.GuideDescriptionId,
                RouteTime = route.RouteTime,
                DifficultyValue = DifficultyConverter.DifficultyValue(route.Difficulty, route.DifficultyDetail),
                RouteType = new RouteTypeDto(route.RouteType),
                PointsConnectionId = route.PointsConnectionId,
                Rappeling = route.Rappeling,
                Rank = route.DescriptionAdjectivePairs.Select(p => p.Adjective).Sum(a => a.Rank),
                ConsistentDirection = consistDirection
                                    ? route.ConsistentDirection
                                    : !route.ConsistentDirection,
                DescriptionAdjective = route.DescriptionAdjectivePairs
                                            .Select(a => GetPairsAdjectiveDto(a))
                                            .ToList()
            };
        }

        private static DescriptionAdjectivePairDto GetPairsAdjectiveDto(DescriptionAdjectivePair adjective)
        {
            return new DescriptionAdjectivePairDto()
            {
                Id = adjective.AdjectiveId,
                Text = adjective.Adjective.Text
            };
        }
    }
}
