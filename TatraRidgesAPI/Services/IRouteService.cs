using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Helpers.RouteSummary;

namespace TatraRidgesAPI.Services
{
    public interface IRouteService
    {
        RidgeAllInformation GetRouteBetweenPoints(PointsPair pointsPair);
        RouteCreateResultDto AddRouteForPoints(AddRouteDto dto);
        RouteSummary GetRouteSummary(List<RouteIdFromDto> routesIdFrom);
        ParametersDto GetParameters();
    }
}