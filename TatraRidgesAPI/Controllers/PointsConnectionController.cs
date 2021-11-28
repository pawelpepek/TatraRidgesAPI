using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.Services;

namespace TatraRidgesAPI.Controllers
{
    [Route("api/connection")]
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
    }
}
