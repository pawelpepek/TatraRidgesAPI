using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Exceptions;
using TatraRidges.Model.Interfaces;
using TatraRidges.Model.Procedures;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public class RoutesConverter
    {
        private readonly ICashScopeService _cash;
        public RoutesConverter(ICashScopeService cash) => _cash = cash;

        public List<RouteDto> Convert(List<RouteIdFromDto> routesIdFrom)
        {
            return routesIdFrom.Select(r => Convert(r)).ToList();
        }

        private RouteDto Convert(RouteIdFromDto routeIdFrom)
        {
            var route = _cash.GetConnections()
                             .SelectMany(c=>c.Routes)
                             .FirstOrDefault(r => r.Id == routeIdFrom.RouteId);
            if(route==null)
            {
                throw new NotFoundException($"Brak drogi numer {routeIdFrom.RouteId}");
            }

            var pointFromRoute = route.ConsistentDirection
                               ? route.PointsConnection.PointId1
                               : route.PointsConnection.PointId2;

            var consistentDirection = routeIdFrom.PointFrom == pointFromRoute;

            return RouteArranger.GetRouteDto(route, consistentDirection);
        }
    }
}
