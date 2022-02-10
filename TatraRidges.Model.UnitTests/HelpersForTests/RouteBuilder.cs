using System;
using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.UnitTests.HelpersForTests
{
    public class RouteBuilder
    {
        private static int _id = 0;

        private readonly RouteDto _route = new();
        private readonly string[] _difficultyValues = { "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X" };

        public RouteBuilder()
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

        public RouteBuilder SetRappelingTrue()
        {
            _route.Rappeling = true;
            return this;
        }
        public RouteBuilder SetConsistentDirectionTrue()
        {
            _route.ConsistentDirection = true;
            return this;
        }

        public RouteBuilder SetDifficulty(decimal value)
        {
            _route.DifficultyValue = value;

            var closestValue = Convert.ToInt32(Math.Round(value, 0));

            var difference = value - closestValue;

            var sign = difference > 0 ? "+" : difference == 0 ? "" : "-";

            _route.Difficulty = _difficultyValues[closestValue] + sign;

            return this;
        }
        public RouteBuilder SetRouteType(RouteTypeDto routeType)
        {
            _route.RouteType = routeType;
            return this;
        }
        public RouteBuilder SetRank(int rank)
        {
            _route.Rank = rank;
            return this;
        }
        public RouteBuilder SetRouteTime(TimeSpan routeTime)
        {
            _route.RouteTime = routeTime;
            return this;
        }

        public RouteDto Create() => _route;
    }
}
