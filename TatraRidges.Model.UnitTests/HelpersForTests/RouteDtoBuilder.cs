using System;
using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.UnitTests.HelpersForTests
{
    public class RouteDtoBuilder
    {
        private static int _id = 0;

        private readonly RouteDto _route = new();
        private readonly string[] _difficultyValues
            = { "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X" };

        public RouteDtoBuilder()
        {
            _route = new RouteDto()
            {
                Id = _id++,
                RouteTime = new TimeSpan(1, 0, 0),
                Difficulty = "I",
                DifficultyValue = 1,
                RouteType = new RouteTypeDto() { Id = 1, Name = "Ściśle granią", Rank = 2 }
            };
        }
        public RouteDtoBuilder SetRappelingTrue()
        {
            _route.Rappeling = true;
            return this;
        }
        public RouteDtoBuilder SetConsistentDirectionTrue()
        {
            _route.ConsistentDirection = true;
            return this;
        }

        public RouteDtoBuilder SetDifficulty(decimal value)
        {
            _route.DifficultyValue = value;

            var closestValue = Convert.ToInt32(Math.Round(value, 0));

            var difference = value - closestValue;

            var sign = difference > 0 ? "+" : difference == 0 ? "" : "-";

            _route.Difficulty = _difficultyValues[closestValue] + sign;

            return this;
        }
        public RouteDtoBuilder SetRouteType(RouteTypeDto routeType)
        {
            _route.RouteType = routeType;
            return this;
        }
        public RouteDtoBuilder SetRank(int rank)
        {
            _route.Rank = rank;
            return this;
        }
        public RouteDtoBuilder SetRouteTime(TimeSpan routeTime)
        {
            _route.RouteTime = routeTime;
            return this;
        }

        public RouteDto Create() => _route;
    }
}
