using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public static class RouteSummaryCreator
    {
        public static RouteSummary Create(List<RouteDto?>routes, TatraDbContext dbContext)
        {
            var builder = new RouteSummaryBuilder(dbContext, routes);
            return builder.SetIsConsistentDirection()
                          .SetIsEmptyRoad()
                          .SetRouteTime()
                          .SetDifficulties()
                          .SetRank()
                          .SetRappeling()
                          .SetDescription()
                          .Build();
        }
    }
}
