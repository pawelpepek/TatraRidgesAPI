using AutoMapper;
using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Interfaces;
using TatraRidges.Model.Procedures;

namespace TatraRidgesAPI.Services
{
    public class PointsConnectionService : IPointsConnectionService
    {
        private readonly TatraDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICashScopeService _cashService;
        private readonly IRidgeFinder _ridgeFinder;

        public PointsConnectionService
            (TatraDbContext dbContext, IMapper mapper, ICashScopeService cashService, IRidgeFinder ridgeFinder)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _cashService = cashService;
            _ridgeFinder = ridgeFinder;
        }

        public IEnumerable<PointsRidgeDto> GetAllRidges()
            => _mapper.Map<List<PointsRidgeDto>>(_cashService.GetConnections());
        
        public long AddConnectionBetweenPoints(PointsConnectionCreateDto dto)
        {
            var newConnection = _mapper.Map<PointsConnection>(dto);

            var connectionCreator = new ConnectionCreator(_dbContext, _ridgeFinder);

            connectionCreator.SaveInDbContext(newConnection);

            _cashService.Reset();

            return newConnection.Id;
        }
    }
}
