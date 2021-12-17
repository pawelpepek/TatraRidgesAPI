using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class AdjectiveModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Adjective>()
                .Property(d => d.Id)
                .SettingsForString(2);
            modelBuilder.Entity<Adjective>()
                .Property(d => d.Text)
                .SettingsForString(50);
            modelBuilder.Entity<Adjective>()
                .Property(d => d.Rank)
                .IsRequired();
        }
    }
}
