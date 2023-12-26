using System.Collections.Generic;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Interfaces;

namespace TatraRidgesAPI.Services
{
    public class CashScopeService : ICashScopeService
    {
        private readonly ICashService _cashService;
        private readonly TatraDbContext _dbContext;

        public CashScopeService(ICashService cashService, TatraDbContext dbContext)
        {
            _cashService = cashService;
            _dbContext = dbContext;
        }

        public void Reset() => _cashService.Reset();

        public List<PointsConnection> GetConnections()
            => _cashService.GetConnections(_dbContext);

        public List<MountainPoint> GetPoints()
            => _cashService.GetPoints(_dbContext);

        public List<Difficulty> GetDifficulties()
            => _cashService.GetDifficulties(_dbContext);

        public List<DifficultyDetail> GetDifficultyDetails()
            => _cashService.GetDifficultyDetails(_dbContext);

        public List<Adjective> GetAdjectives()
            => _cashService.GetAdjectives(_dbContext);
    }
}
