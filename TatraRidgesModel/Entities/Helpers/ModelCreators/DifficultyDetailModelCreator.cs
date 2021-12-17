using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class DifficultyDetailModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<DifficultyDetail>()
                .Property(d => d.Sign)
                .SettingsForString(1);
        }
    }
}
