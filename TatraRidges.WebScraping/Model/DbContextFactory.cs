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
                .UseSqlServer("Server=localhost\\SQLEXPRESS;Database=TatraDb;Trusted_Connection=True;");
            var options = optionsBuilder.Options;

            return new TatraDbContext(options);
        }
    }
}
