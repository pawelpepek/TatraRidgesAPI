using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.Controllers
{
    [Route("api/point")]
    public class MountainPointsController:ControllerBase
    {
        private readonly TatraDbContext _dbContext;
        private readonly IMapper _mapper;

        public MountainPointsController(TatraDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<MountainPointBasicDto>> GetAll()
        {
            var points = _dbContext.MountainPoints
                                   .Include(p=>p.PointType)
                                   .ToList();
            var pointDtos=_mapper.Map<List<MountainPointBasicDto>>(points);
            return Ok(pointDtos);
        }

    }
}
