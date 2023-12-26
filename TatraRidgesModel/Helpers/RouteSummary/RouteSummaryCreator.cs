using TatraRidges.Model.Dtos;
using TatraRidges.Model.Interfaces;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public static class RouteSummaryCreator
    {
        public static RouteSummary Create(List<RouteDto>routes, ICashScopeService cash)
        {
            var builder = new RouteSummaryBuilder(routes, cash);
            return builder.SetIsConsistentDirection()
                          .SetIsEmptyRoad()
                          .SetRouteTime()
                          .SetDifficulties()
                          .SetRank()
                          .SetRappeling()
                          .SetDescription()
                          .SetInfo()
                          .SetWarnings()
                          .Build();
        }
    }
}
