using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Helpers.RouteSummary;
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

            return connections.RidgesContainer.Any() ? Ok(connections) : NotFound();
        }
        [HttpGet("parts")]
        public ActionResult<RouteSummary> GetRouteSummary([FromBody] List<RouteIdFromDto> routesIdFrom)
        {
            var summary = _service.GetRouteSummary(routesIdFrom);

            return summary != null ? Ok(summary) : NotFound();
        }

        [HttpGet("parameters")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ParametersDto> GetParameters()
        {
            var parameters = _service.GetParameters();
            return Ok(parameters);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public ActionResult PostNewRouteBetweenPoints([FromBody] AddRouteDto dto)
        {
            return Ok(_service.AddRouteForPoints(dto));
        }
    }
}
