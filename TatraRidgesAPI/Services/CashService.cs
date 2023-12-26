using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Interfaces;

namespace TatraRidgesAPI.Services
{
    public class CashService : ICashService
    {
        private List<PointsConnection> _connections = null;
        private List<MountainPoint> _points = null;
        private List<Difficulty> _difficulties = null;
        private List<DifficultyDetail> _difficultyDetails = null;
        private List<Adjective> _adjectives = null;

        public void Reset()
        {
            _connections = null;
            _points = null;
        }

        public List<PointsConnection> GetConnections(TatraDbContext dbContext)
        {
            _connections ??= dbContext.PointsConnections.Where(con => con.Ridge)
                                                        .Include(c => c.Routes)
                                                        .ThenInclude(r => r.RouteType)
                                                        .Include(c => c.Routes)
                                                        .ThenInclude(r => r.AdditionalDescriptions)
                                                        .Include(c => c.Routes)
                                                        .ThenInclude(r => r.Difficulty)
                                                        .Include(c => c.Routes)
                                                        .ThenInclude(r => r.DifficultyDetail)
                                                        .Include(c => c.Routes)
                                                        .ThenInclude(r => r.DescriptionAdjectivePairs)
                                                        .ThenInclude(a => a.Adjective)
                                                        .Include(c => c.Routes)
                                                        .ThenInclude(r => r.GuideDescription)
                                                        .ThenInclude(d => d.Guide)
                                                        .ToList();

            return _connections;
        }

        public List<MountainPoint> GetPoints(TatraDbContext dbContext)
        {
            _points ??= dbContext.MountainPoints.ToList();
            return _points;
        }

        public List<Difficulty> GetDifficulties(TatraDbContext dbContext)
        {
            _difficulties ??= dbContext.Difficulties.ToList();
            return _difficulties;
        }

        public List<DifficultyDetail> GetDifficultyDetails(TatraDbContext dbContext)
        {
            _difficultyDetails ??= dbContext.DifficultyDetails.ToList();
            return _difficultyDetails;
        }

        public List<Adjective> GetAdjectives(TatraDbContext dbContext)
        {
            _adjectives ??= dbContext.Adjectives.ToList();
            return _adjectives;
        }
    }
}
