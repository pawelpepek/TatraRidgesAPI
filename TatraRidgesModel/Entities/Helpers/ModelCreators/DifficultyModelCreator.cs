using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class DifficultyModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Difficulty>()
                .Property(d => d.Text)
                .SettingsForString(5);
        }
    }
}
