using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class DescriptionPairModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DescriptionAdjectivePair>()
                .Property(rd => rd.AdjectiveId)
                .IsRequired();
            modelBuilder.Entity<DescriptionAdjectivePair>()
                .Property(rd => rd.RouteId)
                .IsRequired();
        }
    }
}
