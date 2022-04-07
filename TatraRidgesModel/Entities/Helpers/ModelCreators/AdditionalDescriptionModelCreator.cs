using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal class AdditionalDescriptionModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdditionalDescription>()
                .Property(d => d.Id)
                .IsRequired();
            modelBuilder.Entity<AdditionalDescription>()
                .Property(d => d.Description)
                .IsRequired();
            modelBuilder.Entity<AdditionalDescription>()
                .Property(d => d.RouteId)
                .IsRequired();
            modelBuilder.Entity<AdditionalDescription>()
                .Property(d => d.Warning)
                .HasDefaultValue(false)
                .IsRequired();
        }
    }
}
