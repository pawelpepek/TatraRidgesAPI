using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;
using TatraRidgesAPI.Services;

namespace TatraRidgesAPI.Controllers
{
    [Route("api/route")]
    [ApiController]
    public class RouteController : ControllerBase
    {
        private readonly IRouteService _service;

        public RouteController(IRouteService service)
        {
            _service = service;
        }
        [HttpGet]
        public ActionResult<RidgeAllInformation> GetRidgeBetweenPoints([FromQuery] PointsPair points)
        {
            var connections = _service.GetRouteBetweenPoints(points);

            return connections.RidgesContainer.Count() == 0 ? NotFound() : Ok(connections);
        }

        [HttpGet("parameters")]
        public ActionResult<ParametersDto> GetParameters()
        {
            var parameters = _service.GetParameters();
            return  Ok(parameters);
        }
    }
}
