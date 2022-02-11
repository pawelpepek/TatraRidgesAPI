using Microsoft.AspNetCore.Mvc.Testing;
using System.Linq;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Helpers.DataContext
{
    public class MountainPointsTester: TatraDbTester
    {
        public MountainPointsTester(WebApplicationFactory<Startup> factory) : base(factory) { }
        public MountainPoint GetMountainPoint(int id)
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            return dbContext.MountainPoints.FirstOrDefault(p => p.Id == id);
        }
        public MountainPoint GetMountainPoint(bool existing)
        {
            var point = AddNewMountainPoint();
            if(!existing)
            {
                using var scope = GetScope();
                var dbContext = GetDbContext(scope);

                dbContext.MountainPoints.Remove(point);
                dbContext.SaveChanges();
            }
            return point;
        }
        public MountainPoint AddNewMountainPoint(string name = "test")
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var point = DataTemplates.GetMountainPointTemplate(name);

            var similarPoint = dbContext.MountainPoints
                            .Where(p => p.Name.StartsWith(point.Name))
                            .OrderByDescending(p => p.Name.Length)
                            .FirstOrDefault();

            if (similarPoint != null)
            {
                point.Name = similarPoint.Name + "x";
            }

            dbContext.MountainPoints.Add(point);
            dbContext.SaveChanges();

            return point;
        }
    }
}
