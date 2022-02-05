﻿using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;

namespace TatraRidgesAPI.Services
{
    public interface IRouteService
    {
        RidgeAllInformation GetRouteBetweenPoints(PointsPair pointsPair);
        RouteCreateResultDto AddRouteForPoints(AddRouteDto dto);
        ParametersDto GetParameters();
    }
}