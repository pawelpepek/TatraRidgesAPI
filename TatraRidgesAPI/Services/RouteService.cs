using AutoMapper;
using System.Collections.Generic;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Procedures;

namespace TatraRidgesAPI.Services
{
    public class RouteService : IRouteService
    {
        private readonly TatraDbContext _dbContext;
        private readonly IMapper _mapper;

        public RouteService(TatraDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public RidgeAllInformation GetRouteBetweenPoints(PointsPair pointsPair)
        {
            var finder = new RidgeFinder(_dbContext);

            var connection = finder.FindRidge(pointsPair.From, pointsPair.To);

            var ridgeContainer= RouteArranger.GetArrangeRouteDto(connection);

            return new RidgeAllInformation(ridgeContainer, _dbContext);
        }
    }
}
