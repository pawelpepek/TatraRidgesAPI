using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers.RouteSummary;
using Xunit;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer.RouteSummaryBuilderTests
{
    public class SetRankTests
    {
        public static IEnumerable<object[]> GetSamplesRanges()
        {
            var list = new List<(List<RouteDto?> Routes,int Rank)>()
            {
                (new List<RouteDto?>(){null,null },0),
                (new List<RouteDto?>(){ RoutesExamples.GetBuilder()
                                                      .SetRouteTime(new TimeSpan(1, 0, 0))
                                                      .SetRank(6)
                                                      .Create() },
                                                      6),
                (new List<RouteDto?>(){ RoutesExamples.GetBuilder()
                                                      .SetRouteTime(new TimeSpan(1, 0, 0))
                                                      .SetRank(-3)
                                                      .Create(),null},
                                                      -3),
                (new List<RouteDto?>(){RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(2,0,0))
                                                     .SetRank(-2)
                                                     .Create(),
                                       RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(1,3,0))
                                                     .SetRank(5)
                                                     .Create()},
                                                      2),
                (new List<RouteDto?>(){RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(1,3,0))
                                                     .Create(),
                                       RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(2,5,0))
                                                     .Create()},
                                                     5)
            };
            return list.Select(q => new object[] { q });
        }

        [Theory]
        [MemberData(nameof(GetSamplesRanges))]
        public void SetIsConsistentDirection_InsertSampleRoutes_RouteTimeEqualsValuFromSample((List<RouteDto?> Routes, int Rank) example)
        {
            //arrange
            var summaryBuilder = new RouteSummaryBuilder(example.Routes);

            //act
            var summary = summaryBuilder.SetRouteTime().Build();

            //assert
            summary.RouteTime.Should().Equals(example.Rank);
        }
    }
}
