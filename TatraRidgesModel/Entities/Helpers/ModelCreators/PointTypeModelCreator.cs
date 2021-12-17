using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class PointTypeModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PointType>()
                .Property(t => t.Name)
                .HasMaxLength(10)
                .IsRequired();
        }
    }
}
