using System;
using System.Collections.Generic;
using TatraRidges.Model.Dtos;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Routes
{
    public static class AddRouteDtoCreator
    {
        public static AddRouteDto GetSample(int pointId1, int pointId2)
        {
            return new AddRouteDto()
            {
                PointId1 = pointId1,
                PointId2 = pointId2,
                DifficultyValue = 2,
                DifficultySign = "",
                Rappeling = false,
                RouteType = 0,
                GuideDescription = new AddGuideDescriptionDto()
                {
                    GuideId=1,
                    Volume=1,
                    Page=1,
                    Number="1"
                },
                RouteTime = new TimeSpan(1, 0, 0),
                Adjectives = new List<string>()
            };
        }
    }
}
