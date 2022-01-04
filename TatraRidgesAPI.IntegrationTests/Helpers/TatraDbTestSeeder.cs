using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Helpers
{
    public class TatraDbTestSeeder
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public TatraDbTestSeeder(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }
        public IEnumerable<PointsConnection> AddNewRidgeConnections(int pointsCount)
        {
            var result = new List<PointsConnection>();
            if (pointsCount>1)
            {
                var newPoints = Enumerable.Range(0, pointsCount)
                                          .Select(i => AddNewMountainPoint($"test{i}"))
                                          .ToList();
                for(int i = 1; i < newPoints.Count; i++)
                {
                    var point1=newPoints[i-1];
                    var point2=newPoints[i];

                    var newConnection = AddNewConnection(point1, point2, true);

                    result.Add(newConnection);
                }
            }
            return result;
        }

        public MountainPoint AddNewMountainPoint(string name="test")
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var point = GetMountainPointTemplate(name);

            var similarPoint = dbContext.MountainPoints
                            .Where(p => p.Name.StartsWith(point.Name))
                            .OrderByDescending(p=>p.Name.Length)
                            .FirstOrDefault();
                             
            if(similarPoint!=null)
            {
                point.Name = similarPoint.Name + "x";
            }

            dbContext.MountainPoints.Add(point);
            dbContext.SaveChanges();

            return point;
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

        private static MountainPoint GetMountainPointTemplate(string name="test")
        {
            return new MountainPoint()
            {
                Name = name,
                AlternativeName = name,
                Evaluation = 2000,
                Latitude = 49.12m,
                Longitude = 19.91m,
                PointTypeId = 1,
                PrecisedEvaluation = true,
                WikiAddress = $"\\{name}",
                WikiLatitude = 49.12m,
                WikiLongitude = 19.91m
            };
        }

        private IServiceScope GetScope()
        {
            var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>();
            return scopeFactory.CreateScope();
        }
        private static TatraDbContext GetDbContext(IServiceScope scope)
        {
            return scope.ServiceProvider.GetService<TatraDbContext>();
        }
    }
}
