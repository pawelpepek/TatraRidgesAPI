using System.Collections.Generic;
using TatraRidges.Model.Entities;

namespace TatraRidges.WebScraping.Model
{
    public static class DbContextSaver
    {
        public static void Save(List<MountainPoint> points)
        {
            using var context=DbContextFactory.GetContext();
            context.MountainPoints.AddRange(points);
            context.SaveChanges();
        }
    }
}
