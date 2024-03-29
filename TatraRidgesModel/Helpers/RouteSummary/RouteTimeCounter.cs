﻿using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public static class RouteTimeCounter
    {
        public static long TicksCount(List<RouteDto> routes)
        {
            return routes.Where(r=>r!=null).Sum(r => r.RouteTime.Ticks);
        }
    }
}
