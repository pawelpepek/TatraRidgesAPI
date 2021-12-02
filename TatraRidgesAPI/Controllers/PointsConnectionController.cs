using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.Services;

namespace TatraRidgesAPI.Controllers
{
    [Route("api/connection")]
    [ApiController]
    public class PointsConnectionController : ControllerBase
    {
        private readonly IPointsConnectionService _service;

        public PointsConnectionController(IPointsConnectionService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<PointsRidgeDto>> GetAllRidges()
        {
            return Ok(_service.GetAllRidges());
        }

        [HttpPost]
        [Authorize(Roles ="Admin")]
        public ActionResult PostNewPointsConnection([FromBody] PointsConnectionCreateDto dto)
        {
            var newConnectionId = _service.AddConnectionBetweenPoints(dto);
            return Ok(newConnectionId);
        }
    }
}
