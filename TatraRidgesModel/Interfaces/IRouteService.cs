using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Helpers.RouteSummary;

namespace TatraRidges.Model.Interfaces
{
    public interface IRouteService
    {
        RidgeAllInformation GetRouteBetweenPoints(PointsPair pointsPair);
        RouteCreateResultDto AddRouteForPoints(AddRouteDto dto);
        RouteSummary GetRouteSummary(List<RouteIdFromDto> routesIdFrom);
        ParametersDto GetParameters();
    }
}