using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Exceptions;
using TatraRidges.Model.Procedures;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public class RoutesConverter
    {
        private readonly TatraDbContext _dbContext;
        public RoutesConverter(TatraDbContext dbContext) => _dbContext = dbContext;

        public List<RouteDto> Convert(List<RouteIdFromDto> routesIdFrom)
        {
            return routesIdFrom.Select(r => Convert(r)).ToList();
        }

        private RouteDto Convert(RouteIdFromDto routeIdFrom)
        {
            var route = _dbContext.Routes.Include(r => r.PointsConnection)
                                         .Include(r => r.DescriptionAdjectivePairs)
                                         .ThenInclude(a => a.Adjective)
                                         .Include(r => r.Difficulty)
                                         .Include(r => r.DifficultyDetail)
                                         .Include(r => r.GuideDescription)
                                         .ThenInclude(g => g.Guide)
                                         .Include(r => r.RouteType)
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
