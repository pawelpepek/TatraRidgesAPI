using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.UnitTests.HelpersForTests;
using Xunit;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer.RouteSummaryBuilderTests
{
    public class SetRappelingTests:MethodTestsTemplate
    {
        private static IEnumerable<object[]> GetSamplesRangesWithouthRappeling()
        {
            var builder = new RouteBuilder();

            var list = new List<List<RouteDto?>>()
            {
                new List<RouteDto?>(){ null,null},
                new List<RouteDto?>(){ GetSimplyRoute()  },
                new List<RouteDto?>(){ GetSimplyRoute(),null},
                new List<RouteDto?>(){ GetSimplyRoute(), GetSimplyRoute() },
            };
            return list.Select(q => new object[] { q });
        }
        private static IEnumerable<object[]> GetSamplesRangesWithRappeling()
        {
            var builder = new RouteBuilder();

            var list = new List<List<RouteDto?>>()
            {
                new List<RouteDto?>(){ GetRouteWithRappeling(), null},
                new List<RouteDto?>(){ GetRouteWithRappeling(),GetSimplyRoute() },
            };
            return list.Select(q => new object[] { q });
        }


        [Theory]
        [MemberData(nameof(GetSamplesRangesWithRappeling))]
        public void SetRappeling_InsertRoutesWithRappeling_RappelingEqualsTrue(List<RouteDto?> routes)
        {
            var summary = ArrangeAndAct(routes);

            //assert
            Assert.True(summary.Rappeling);
        }
        [Theory]
        [MemberData(nameof(GetSamplesRangesWithouthRappeling))]
        public void SetRappeling_InsertRoutesWithouthRappeling_RappelingEqualsFalse(List<RouteDto?> routes)
        {
            var summary = ArrangeAndAct(routes);

            //assert
            Assert.False(summary.Rappeling);
        }
        private static RouteDto GetRouteWithRappeling() => RoutesExamples.GetBuilder().SetRappelingTrue().Create();

        protected override void Act()=>_summaryBuilder.SetRappeling();
    }
}