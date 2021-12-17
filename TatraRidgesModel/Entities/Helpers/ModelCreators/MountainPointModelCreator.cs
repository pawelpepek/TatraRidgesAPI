using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class MountainPointModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.PointTypeId)
                .IsRequired();
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.Name)
                .SettingsForString(50);
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.AlternativeName)
                .SettingsForString(50);
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.PrecisedEvaluation)
                .IsRequired();
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.WikiLatitude)
                .SettingsForDecimal();
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.WikiLongitude)
                .SettingsForDecimal();
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.Latitude)
                .SettingsForDecimal();
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.Longitude)
                .SettingsForDecimal();
            modelBuilder.Entity<MountainPoint>()
                .Property(p => p.WikiAddress)
                .IsRequired();
        }
    }
}
