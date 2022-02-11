using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Procedures;
using TatraRidges.Model.UnitTests.HelpersForTests;
using Xunit;

namespace TatraRidges.Model.UnitTests.Procedures
{
    public class RouteArrangerTests
    {
        private static readonly GuideDescription _guideDescription = new()
        {
            Id = 1,
            Guide = new Guide() { Id = 1 },
            Number = "1",
            Volume = 1,
            Page = 1
        };
        private static readonly List<List<Route>> _routes = new()
        {
            new List<Route>() 
            { 
                new RouteBuilder(1).Create(), 
                new RouteBuilder(1).SetConsistentDirectionTrue().Create() 
            },
            new List<Route>() 
            { 
                new RouteBuilder(2).SetRouteType(1).Create(),
                new RouteBuilder(2).Create(),
            },
            new List<Route>() 
            {
                new RouteBuilder(3).SetRank(5).Create(),
                new RouteBuilder(1).Create(),
            },
            new List<Route>() 
            {
                new RouteBuilder(4).SetDifficulty(3,"-").Create(), 
                new RouteBuilder(4).SetDifficulty(3,"+").Create(),
            },
            new List<Route>()
            {
                new RouteBuilder(5).Create(),
                new RouteBuilder(5).SetRappelingTrue().Create(),
            },
            new List<Route>()
            {
                new RouteBuilder(6).SetRouteTime(new TimeSpan(1,1,0)).Create(),
                new RouteBuilder(6).Create(),
            }
        };

        private readonly List<PointsConnection> _pointsConnections = new()
        {
            new PointsConnection() { Id = 1, PointId1 = 1, PointId2 = 2, Ridge = true, Routes = _routes[0] },
            new PointsConnection() { Id = 2, PointId1 = 3, PointId2 = 2, Ridge = true, Routes = _routes[1] },
            new PointsConnection() { Id = 3, PointId1 = 3, PointId2 = 4, Ridge = true, Routes = _routes[2] },
            new PointsConnection() { Id = 4, PointId1 = 5, PointId2 = 4, Ridge = true, Routes = _routes[3] },
            new PointsConnection() { Id = 5, PointId1 = 5, PointId2 = 6, Ridge = true, Routes = _routes[4] },
            new PointsConnection() { Id = 6, PointId1 = 7, PointId2 = 6, Ridge = true, Routes = _routes[5] },
            new PointsConnection() { Id = 40, PointId1 = 1, PointId2 = 5, Ridge = true },
            new PointsConnection() { Id = 41, PointId1 = 1, PointId2 = 6, Ridge = true },
            new PointsConnection() { Id = 42, PointId1 = 2, PointId2 = 7, Ridge = true },
        };

        [Fact]
        public void GetArrangeRouteDto_WithSampleData_ReturnsExpected()
        {
            //arrange
            var ridgeRoute = new List<PointsConnectionWithDirection>()
            {
                new PointsConnectionWithDirection()
                {
                    PointsConnection=_pointsConnections[0],
                    ConsistDirection=true
                },
                new PointsConnectionWithDirection()
                {
                    PointsConnection=_pointsConnections[1],
                    ConsistDirection=false
                },
                new PointsConnectionWithDirection()
                {
                    PointsConnection=_pointsConnections[2],
                    ConsistDirection=true
                },
                new PointsConnectionWithDirection()
                {
                    PointsConnection=_pointsConnections[3],
                    ConsistDirection=false
                },
                new PointsConnectionWithDirection()
                {
                    PointsConnection=_pointsConnections[4],
                    ConsistDirection=true
                },
                new PointsConnectionWithDirection()
                {
                    PointsConnection=_pointsConnections[5],
                    ConsistDirection=false
                }
            };

            var firstExpected = new bool[] { false, false, true, true, true,false};

            var expected = firstExpected.Select(GetRidgeWithRoutesDto).ToList();

            //act 
            var result = RouteArranger.GetArrangeRouteDto(ridgeRoute);

            //assert
            result.Should().BeEquivalentTo(expected,options=>options.Excluding(r => r.Routes));

            for (var i=0;i<result.Count;i++)
            {
                Assert.Equal( expected[i].Routes.Select(r=>r.Id), 
                              result[i].Routes.Select(r => r.Id));
            }
        }

        private static RouteDto GetRouteDto(int connection, int item)
        {
            var route = _routes[connection][item];
            return new RouteDto()
            {
                Id = route.Id,
            };
        }
        private RidgeWithRoutesDto GetRidgeWithRoutesDto(bool firstExpected, int index)
        {
            var firstIndex = firstExpected ? 0 : 1;
            var secondIndex = firstExpected ? 1 : 0;

            return new RidgeWithRoutesDto()
            {
                PointId1 = index+1,
                PointId2 = index + 2,
                PointsConnectionId = index+1,
                Routes = new List<RouteDto>() { GetRouteDto(index, firstIndex), GetRouteDto(index, secondIndex) }
            };
        }
    }
}
