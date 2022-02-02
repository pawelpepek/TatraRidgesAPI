using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidgesAPI.Services;

namespace TatraRidgesAPI.Controllers
{
    [Route("api/point")]
    [ApiController]
    public class MountainPointsController : ControllerBase
    {
        private readonly IMountainPointService _service;

        public MountainPointsController(IMountainPointService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<MountainPointBasicDto>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
        public ActionResult Move([FromRoute] int id, [FromBody] PointGPSDto newCoordinates)
        {
            _service.Move(id, newCoordinates);
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            _service.Delete(id);
            return Ok();
        }
    }
}
