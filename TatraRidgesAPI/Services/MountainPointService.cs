using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidgesAPI.Exceptions;

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
            var point = GetPointById(id);
            point.Latitude = newCoordinate.Latitude;
            point.Longitude = newCoordinate.Longitude;
            _dbContext.SaveChanges();
        }

        private MountainPoint GetPointById(int id)
        {
            var point = _dbContext.MountainPoints.FirstOrDefault(p => p.Id == id);
            if (point == null)
            {
                throw new NotFoundException("Nie ma puntu z takim Id");
            }
            return point;
        }

    }
}
