using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;

namespace TatraRidgesAPI.Services
{
    public interface IRouteService
    {
        IEnumerable<RidgeWithRoutesDto> GetRouteBetweenPoints(PointsPair pointsPair);
    }
}