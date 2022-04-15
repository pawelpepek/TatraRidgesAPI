using System;
using System.Collections.Generic;
using TatraRidges.Model.Entities;

namespace TatraRidges.Model.UnitTests.HelpersForTests
{
    public class RouteBuilder
    {
        private static int _id = 0;

        private static readonly GuideDescription _guideDescription = new()
        {
            Id = 1,
            Guide = new Guide() { Id = 1 },
            Number = "1",
            Volume = 1,
            Page = 1
        };

        private readonly Route _route = new();

        public RouteBuilder(long pointConnectionId)
        {
            _route = new Route()
            {
                Id = _id++,
                PointsConnectionId = pointConnectionId,
                RouteType = new RouteType() { Rank = 0 },
                DifficultyDetail = new DifficultyDetail() { Sign = "" },
                Difficulty = GetDifficulty(0),
                Rappeling = false,
                GuideDescription = _guideDescription,
                DescriptionAdjectivePairs = new List<DescriptionAdjectivePair>()
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

        public RouteBuilder SetDifficulty(byte value, string sign = "")
        {
            _route.Difficulty = GetDifficulty(value);
            _route.DifficultyDetail = new DifficultyDetail() { Id = 0, Sign = sign };

            return this;
        }
        public RouteBuilder SetRouteType(byte routeTypeRank)
        {
            _route.RouteType = new RouteType() { Rank = routeTypeRank };
            return this;
        }
        public RouteBuilder SetRank(short adjectiveRank)
        {
            _route.DescriptionAdjectivePairs = new List<DescriptionAdjectivePair>()
            {
                new DescriptionAdjectivePair()
                {
                    Adjective=new Adjective(){ Id="ce", Rank=adjectiveRank},
                    Id=1,
                    RouteId=_route.Id,
                    AdjectiveId="ce"
                }
            };
            return this;
        }
        public RouteBuilder SetRouteTime(TimeSpan routeTime)
        {
            _route.RouteTime = routeTime;
            return this;
        }

        public Route Create() => _route;

        private static Difficulty GetDifficulty(byte value)
        {
            return new Difficulty()
            {
                Id = value,
                Text = new string('I', value),
            };
        }
    }
}
