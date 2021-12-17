using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class GuideModelCreate
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Guide>()
                .Property(g => g.ShortName)
                .SettingsForString(5);
            modelBuilder.Entity<Guide>()
                .Property(g => g.Name)
                .SettingsForString(50);
            modelBuilder.Entity<Guide>()
                .Property(g => g.Author)
                .SettingsForString(50);
        }
    }
}
