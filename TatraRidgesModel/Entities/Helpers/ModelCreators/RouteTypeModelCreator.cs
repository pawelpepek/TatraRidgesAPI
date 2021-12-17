using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class RouteTypeModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RouteType>()
                .Property(t => t.Name)
                .SettingsForString(20);
            modelBuilder.Entity<RouteType>()
                .Property(t => t.Rank)
                .IsRequired();
        }
    }
}
