﻿using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Helpers.DataContext
{
    public class PointsConnectionTester: TatraDbTester
    {
        public PointsConnectionTester(WebApplicationFactory<Startup> factory):base(factory){}

        public bool IsConnectionInDataContext(PointsConnectionCreateDto model)
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            return dbContext.PointsConnections.ToList()
                                              .Any(c => ConnectionEqualsModel(c, model));
        }

        public List<PointsConnection> AddNewRidgeConnections(int pointsCount)
        {
            var pointSeeder = new MountainPointsTester(_factory);

            var result = new List<PointsConnection>();
            if (pointsCount > 1)
            {
                var newPoints = Enumerable.Range(0, pointsCount)
                                          .Select(i => pointSeeder.AddNewMountainPoint($"test{i}"))
                                          .ToList();
                for (int i = 1; i < newPoints.Count; i++)
                {
                    var point1 = newPoints[i - 1];
                    var point2 = newPoints[i];

                    var newConnection = AddNewConnection(point1, point2, true);

                    result.Add(newConnection);
                }
            }
            return result;
        }
        public void DeleteAllConnectionRidgeWithouthRoutes()
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var connectionToDelete=dbContext.PointsConnections.Include(c => c.Routes)
                                       .Where(c => c.Ridge && c.Routes.Any())
                                       .ToList();

            dbContext.PointsConnections.RemoveRange(connectionToDelete);
            dbContext.SaveChanges();
        }

        public (int pointId1, int pointId2) GetLoppedPoints()
        {
            var connectionsCount = 10;

            var connections = AddNewRidgeConnections(connectionsCount);

            return (connections[connectionsCount - 2].PointId1, connections[0].PointId2);
        }

        private static bool ConnectionEqualsModel(PointsConnection connection, PointsConnectionCreateDto model)
        {
            return connection.PointId1 == model.PointId1 
                && connection.PointId2 == model.PointId2 
                && connection.Ridge == model.Ridge;
        }
        private PointsConnection AddNewConnection(MountainPoint point1, MountainPoint point2, bool ridge)
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var newConnection = new PointsConnection()
            {
                PointId1 = point1.Id,
                PointId2 = point2.Id,
                Ridge = ridge
            };
            dbContext.PointsConnections.Add(newConnection);
            dbContext.SaveChanges();

            return newConnection;
        }
    }
}
