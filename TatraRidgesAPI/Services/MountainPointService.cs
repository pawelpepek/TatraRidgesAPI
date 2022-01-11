using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Procedures;

namespace TatraRidgesAPI.Services
{
    public class MountainPointService : IMountainPointService
    {
        private readonly TatraDbContext _dbContext;
        private readonly IMapper _mapper;

        public MountainPointService(TatraDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public IEnumerable<MountainPointBasicDto> GetAll()
        {
           var points = _dbContext.MountainPoints
                       .Include(p => p.PointType)
                       .ToList();
            return _mapper.Map<List<MountainPointBasicDto>>(points);
        }
        public void Move(int id, PointGPSDto newCoordinate)
        {
            var mountainPointsMover = new MountainPointsMover(_dbContext);

            mountainPointsMover.MovePoint(id, newCoordinate);
        }
        public void Delete(int id)
        {
            var finder = new MountainPointsFinder(_dbContext);

            finder.DeletePointById(id);
        }
    }
}
