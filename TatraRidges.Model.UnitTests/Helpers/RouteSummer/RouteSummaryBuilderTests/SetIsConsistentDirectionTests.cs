using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using Xunit;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer.RouteSummaryBuilderTests
{
    public class SetIsConsistentDirectionTests : MethodTestsTemplate
    {
        private static IEnumerable<object[]> GetInSamplesRangesWithNotConsistentDirectionRoute()
        {
            var list = new List<List<RouteDto?>>()
            {
                new List<RouteDto?>(){ GetSimplyRoute()  },
                new List<RouteDto?>(){ GetSimplyRoute(),null},
                new List<RouteDto?>(){ GetConsistentDirectionRoute(), GetSimplyRoute() },
            };
            return list.Select(q => new object[] { q });
        }
        private static IEnumerable<object[]> GetInSamplesRangesAllConsisntentDirection()
        {
            var list = new List<List<RouteDto?>>()
            {
                new List<RouteDto?>(){ GetConsistentDirectionRoute() },
                new List<RouteDto?>(){ GetConsistentDirectionRoute(), null},
                new List<RouteDto?>(){ GetConsistentDirectionRoute(), GetConsistentDirectionRoute() },
            };
            return list.Select(q => new object[] { q });
        }

        [Theory]
        [MemberData(nameof(GetInSamplesRangesAllConsisntentDirection))]
        public void SetIsConsistentDirection_InsertRoutesWithConsistentDirection_IsConsistentDirectionEqualsTrue(List<RouteDto?> routes)
        {
            var summary = ArrangeAndAct(routes);

            //assert
            Assert.True(summary.IsConsistentDirection);
        }

        [Theory]
        [MemberData(nameof(GetInSamplesRangesWithNotConsistentDirectionRoute))]
        public void SetIsConsistentDirection_InsertRoadsWithOneNotConsistentDirection_ConsistentDirectionEqualsFalse(List<RouteDto?> routes)
        {
            var summary = ArrangeAndAct(routes);

            //assert
            Assert.False(summary.IsConsistentDirection);
        }

        protected override void Act() => _summaryBuilder.SetIsConsistentDirection();

        private static RouteDto GetConsistentDirectionRoute() => GetBuilder().SetConsistentDirectionTrue().Create();
    }
}
