using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class GuideDescriptionModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GuideDescription>()
                .Property(g => g.Number)
                .SettingsForString(20);
            modelBuilder.Entity<GuideDescription>()
                .Property(g => g.Page)
                .IsRequired();
            modelBuilder.Entity<GuideDescription>()
                .Property(g => g.Volume)
                .IsRequired();
            modelBuilder.Entity<GuideDescription>()
                .Property(g => g.GuideId)
                .IsRequired();
        }
    }
}
