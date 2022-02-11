using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers.RouteSummary;
using TatraRidges.Model.UnitTests.HelpersForTests;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer
{
    public abstract class MethodTestsTemplate
    {
        protected RouteSummaryBuilder _summaryBuilder;

        protected static RouteDto GetSimplyRoute() => GetBuilder().Create();
        protected static RouteDtoBuilder GetBuilder() => new();

        protected RouteSummary ArrangeAndAct(List<RouteDto?> routes)
        {
            //arrange
            _summaryBuilder = new RouteSummaryBuilder(routes);

            //act
            Act();
            return _summaryBuilder.Build();
        }

        protected abstract void Act();
    }
}
