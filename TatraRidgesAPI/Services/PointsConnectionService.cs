using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Procedures;

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
            var connections = new Connections(_dbContext);

            return _mapper.Map<List<PointsRidgeDto>>(connections.GetAll(true));
        }
        public long AddConnectionBetweenPoints(PointsConnectionCreateDto dto)
        {
            var newConnection = _mapper.Map<PointsConnection>(dto);

            var connectionCreator = new ConnectionCreator(_dbContext);

            connectionCreator.SaveInDbContext(newConnection);

            return newConnection.Id;
        }
    }
}
