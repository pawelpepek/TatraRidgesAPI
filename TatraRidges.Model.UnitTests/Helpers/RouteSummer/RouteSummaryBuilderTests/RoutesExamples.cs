using TatraRidges.Model.Dtos;
using TatraRidges.Model.UnitTests.HelpersForTests;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer.RouteSummaryBuilderTests
{
    public class RoutesExamples
    {
        public static RouteDto GetSimplyRoute() => GetBuilder().Create();
        public static RouteBuilder GetBuilder()=>  new ();

    }
}
