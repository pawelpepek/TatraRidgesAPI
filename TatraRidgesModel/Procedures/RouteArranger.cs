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

        public static RouteDto GetRouteDto(Route route, bool consistDirection)
        {
            return new RouteDto()
            {
                Id = route.Id,
                Difficulty = route.Difficulty.Text + route.DifficultyDetail.Sign,
                GuideDescription = GetGuideDescriptionDto(route.GuideDescription),
                RouteTime = route.RouteTime,
                DifficultyValue = DifficultyConverter.GetValueForDifficulty(route.Difficulty, route.DifficultyDetail),
                RouteType = new RouteTypeDto(route.RouteType),
                Rappeling = route.Rappeling,
                Rank = route.DescriptionAdjectivePairs.Select(p => p.Adjective).Sum(a => a.Rank),
                ConsistentDirection = consistDirection
                                    ? route.ConsistentDirection
                                    : !route.ConsistentDirection,
                DescriptionAdjective = route.DescriptionAdjectivePairs
                                            .Select(a => GetAdjectiveDto(a))
                                            .ToList(),
                Warning = GetDescription(route, true),
                Info = GetDescription(route, false)
            };
        }

        private static string GetDescription(Route route, bool warning)
        {
            var additional = route.AdditionalDescriptions;

            var descriptions = new List<string>();

            if (additional != null)
            {
                var rows = additional.Where(r => r.Warning == warning)
                                   .Select(r => r.Description)
                                   .ToList();
                descriptions.AddRange(rows);
            }


            if (warning)
            {
                var text = WarningsAdjectives.GetText(new List<Route>() { route });
                descriptions.AddRange(text);
            }

            return string.Join("\n", descriptions);
        }

        private static RidgeWithRoutesDto GetRidgeWithRoutesDto(PointsConnectionWithDirection ridgePart)
        {
            var connection = ridgePart.PointsConnection;

            var point1Id = connection.PointId1;
            var point2Id = connection.PointId2;

            var routes = connection.Routes.Select(r => GetRouteDto(r, ridgePart.ConsistDirection))
                                          .OrderByDescending(rt => rt.ConsistentDirection)
                                          .ThenBy(rt => rt.RouteType.Rank)
                                          .ThenByDescending(rt => rt.Rank)
                                          .ThenByDescending(rt => rt.DifficultyValue)
                                          .ThenBy(rt => rt.Rappeling)
                                          .ThenBy(rt => rt.RouteTime)
                                          .ToList();

            var ridgeRoute = new RidgeWithRoutesDto()
            {
                PointId1 = ridgePart.ConsistDirection ? point1Id : point2Id,
                PointId2 = ridgePart.ConsistDirection ? point2Id : point1Id,

                PointsConnectionId = connection.Id,

                Routes = routes
            };
            return ridgeRoute;
        }

        private static GuideDescriptionDto GetGuideDescriptionDto(GuideDescription guideDescription)
        {
            return new GuideDescriptionDto()
            {
                Guide = guideDescription.Guide.ShortName,
                Number = guideDescription.Number,
                Page = guideDescription.Page,
                Volume = guideDescription.Volume
            };
        }

        private static AdjectiveDto GetAdjectiveDto(DescriptionAdjectivePair adjective)
        {
            return new AdjectiveDto()
            {
                Id = adjective.AdjectiveId,
                Text = adjective.Adjective.Text
            };
        }
    }
}