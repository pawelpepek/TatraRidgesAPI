using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Entities;

namespace TatraRidges.WebScraping.Model
{
    public static class DbContextFactory
    {
        public static TatraDbContext GetContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<TatraDbContext>();
            optionsBuilder
                .UseNpgsql("Host=localhost:5432;Username=postgres;Password=postgres;Database=tatradb");
            var options = optionsBuilder.Options;

            return new TatraDbContext(options);
        }
    }
}
