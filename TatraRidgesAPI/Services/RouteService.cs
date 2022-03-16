﻿using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Helpers.RouteSummary;
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

            var ridgeContainer = RouteArranger.GetArrangeRouteDto(connection);

            return new RidgeAllInformation(ridgeContainer, _dbContext);
        }

        public RouteSummary GetRouteSummary(List<RouteIdFromDto> routesIdFrom)
        {
            var ridges = (new RoutesConverter(_dbContext)).Convert(routesIdFrom);

            return RouteSummaryCreator.Create(ridges, _dbContext);
        }

        public RouteCreateResultDto AddRouteForPoints(AddRouteDto dto)
        {
            var (newRouteId, connection) = new RouteCreator(_dbContext).SaveInDbContext(dto);

            return new RouteCreateResultDto()
            {
                RouteId = newRouteId,
                PointsRidge = _mapper.Map<PointsRidgeDto>(connection)
            };
        }

        public ParametersDto GetParameters()
        {
            var adjectives = _dbContext.Adjectives.ToList();
            var guides = _dbContext.Guides.ToList();
            var routeTypes = _dbContext.RouteTypes.ToList();

            var difficulties = new DifficultyHandler(_dbContext).GetAllDifficulties();

            return new ParametersDto()
            {
                Adjectives = _mapper.Map<List<AdjectiveDto>>(adjectives),
                Difficulties = difficulties,
                Guides = _mapper.Map<List<GuideDto>>(guides),
                RouteTypes = _mapper.Map<List<RouteTypeDto>>(routeTypes)
            };
        }
    }
}
