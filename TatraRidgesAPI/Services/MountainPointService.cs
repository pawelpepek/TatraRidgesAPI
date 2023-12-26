using AutoMapper;
using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Interfaces;
using TatraRidges.Model.Procedures;

namespace TatraRidgesAPI.Services
{
    public class MountainPointService : IMountainPointService
    {
        private readonly TatraDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICashScopeService _cashService;

        public MountainPointService(TatraDbContext dbContext, IMapper mapper, ICashScopeService cashService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _cashService = cashService;
        }

        public IEnumerable<MountainPointDto> GetAll()
            => _mapper.Map<List<MountainPointDto>>(_cashService.GetPoints());

        public void Move(int id, PointGPSDto newCoordinate)
        {
            var mountainPointsMover = new MountainPointsMover(_dbContext);

            mountainPointsMover.MovePoint(id, newCoordinate);
        }

        public void Delete(int id)
        {
            var finder = new MountainPointsFinder(_dbContext);

            finder.DeletePointById(id);

            _cashService.Reset();
        }
    }
}
