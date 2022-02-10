using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers.RouteSummary;
using TatraRidges.Model.UnitTests.Helpers.RouteSummer.RouteSummaryBuilderTests;
using Xunit;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer
{
    public class RouteTimeCounterTests
    {
        public static IEnumerable<object[]> GetSamplesRanges()
        {
            var list = new List<(List<RouteDto?> Routes, long ticks)>()
            {
                (new List<RouteDto?>(){null,null },0),
                (new List<RouteDto?>(){ RoutesExamples.GetBuilder()
                                                      .SetRouteTime(new TimeSpan(1, 0, 0))
                                                      .Create() },
                                                      new TimeSpan(1, 0, 0).Ticks),
                (new List<RouteDto?>(){ RoutesExamples.GetBuilder()
                                                      .SetRouteTime(new TimeSpan(1, 0, 0))
                                                      .SetRank(-3)
                                                      .Create(),null},
                                                      new TimeSpan(1, 0, 0).Ticks),
                (new List<RouteDto?>(){RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(2,0,0))
                                                     .SetRank(-2)
                                                     .Create(),
                                       RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(1,3,0))
                                                     .SetRank(5)
                                                     .Create()},
                                                      new TimeSpan(3, 3, 0).Ticks),
                (new List<RouteDto?>(){RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(1,3,0))
                                                     .Create(),
                                       RoutesExamples.GetBuilder()
                                                     .SetRouteTime(new TimeSpan(2,5,0))
                                                     .Create()},
                                                     new TimeSpan(2, 5, 0).Ticks)
            };
            return list.Select(q => new object[] { q });
        }


        [Theory]
        [MemberData(nameof(GetSamplesRanges))]
        public void TicksCount_InsertRoutes_ReturnsValue((List<RouteDto> Routes, long Ticks)example)
        {
            var result=RouteTimeCounter.TicksCount(example.Routes);

            //Assert
            result.Should().Equals(example.Ticks);
        }
    }
}
