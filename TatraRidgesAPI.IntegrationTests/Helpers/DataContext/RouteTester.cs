using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Helpers.DataContext
{
    public class RouteTester : TatraDbTester
    {
        public RouteTester(WebApplicationFactory<Startup> factory) : base(factory) { }

        public List<RouteIdFromDto> GetExistingRoutes()
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var i = 0;

            var first = GetDto(dbContext.Routes.Include(r => r.PointsConnection).First(), true);
            var second = GetDto(dbContext.Routes.Include(r => r.PointsConnection).Last(), false);

            return new List<RouteIdFromDto>() { first, second };
        }

        public RouteIdFromDto GetNotExistingRouteIndex()
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            return new RouteIdFromDto()
            {
                RouteId = dbContext.Routes.Max(r => r.Id) + 1,
                PointFrom = 1
            };
        }

        private static RouteIdFromDto GetDto(Route route, bool consistentDirection)
        {
            return new RouteIdFromDto()
            {
                RouteId = route.Id,
                PointFrom = consistentDirection
                          ? route.PointsConnection.PointId1
                          : route.PointsConnection.PointId2
            };
        }
    }
}
