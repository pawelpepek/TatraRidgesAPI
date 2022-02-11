using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using Xunit;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer.RouteSummaryBuilderTests
{
    public class SetIsEmptyRouteTests:MethodTestsTemplate
    {
        public static IEnumerable<object[]> GetInSamplesRangesWhithNulls()
        {
            var list = new List<List<RouteDto?>>()
            {
                new List<RouteDto?>(){null,null},
                new List<RouteDto?>(){null },
                new List<RouteDto?>(){null, RoutesExamples.GetSimplyRoute() },
                new List<RouteDto?>(){ RoutesExamples.GetSimplyRoute(),null },
            };
            return list.Select(q => new object[] { q });
        }

        public static IEnumerable<object[]> GetInSamplesRangesWhithouthNulls()
        {
            var list = new List<List<RouteDto?>>()
            {
                new List<RouteDto?>(){ RoutesExamples.GetSimplyRoute() },
                new List<RouteDto?>(){ RoutesExamples.GetSimplyRoute(), RoutesExamples.GetBuilder().SetRappelingTrue().Create() },
            };
            return list.Select(q => new object[] { q });
        }

        [Theory]
        [MemberData(nameof(GetInSamplesRangesWhithNulls))]
        public void SetIsEmptyRoute_InsertRoutesWithEmptyRoute_IsEmptyRouteEqualsTrue(List<RouteDto?> routes)
        {
            var summary=ArrangeAndAct(routes);

            //assert
            Assert.True(summary.IsEmptyRoute);
        }
        [Theory]
        [MemberData(nameof(GetInSamplesRangesWhithouthNulls))]
        public void SetIsEmptyRoute_InsertRoadsWithouthEmpty_EmptyRoadsEqualsFalse(List<RouteDto?> routes)
        {
            var summary = ArrangeAndAct(routes);

            //assert
            Assert.False(summary.IsEmptyRoute);
        }

        protected override void Act() => _summaryBuilder.SetIsEmptyRoad();
    }
}
