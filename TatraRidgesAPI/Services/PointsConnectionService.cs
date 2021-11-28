using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.Services
{
    public class PointsConnectionService : IPointsConnectionService
    {
        private readonly TatraDbContext _dbContext;
        private readonly IMapper _mapper;

        public PointsConnectionService(TatraDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public IEnumerable<PointsRidgeDto> GetAllRidges()
        {
            var ridges = _dbContext.PointsConnections.Where(r => r.Ridge);
            return _mapper.Map<List<PointsRidgeDto>>(ridges);
        }

    }
}
