using TatraRidges.Model.Seeders.ParametersData; 
using TatraRidges.Model.Seeders.ExampleData;
using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Seeders
{
    public class DbSeeder
    {
        private readonly TatraDbContext _dbContext;
        private bool isPowered = false;
        public DbSeeder(TatraDbContext dbContext) => _dbContext = dbContext;
        public void Seed()
        {
            if (_dbContext.Database.CanConnect())
            {
                if (_dbContext.Database.IsRelational())
                {
                    var pendingMigrations = _dbContext.Database.GetPendingMigrations();
                    if (pendingMigrations != null && pendingMigrations.Any())
                    {
                        _dbContext.Database.Migrate();
                    }
                }
                SeedParameters();
                SeedExample();
            }
        }
        private void SeedParameters()
        {
            if(!isPowered)
            {
                isPowered = true;
                SeedTable(new DifficultiesData(_dbContext));
                SeedTable(new DifficultyDetailsData(_dbContext));
                SeedTable(new PointTypesData(_dbContext));
                SeedTable(new AdjectivesData(_dbContext));
                SeedTable(new GuidesData(_dbContext));
                SeedTable(new RouteTypesData(_dbContext));
                SeedTable(new RolesData(_dbContext));
            }
        }
        private void SeedExample()
        {
            if (!_dbContext.Routes.Any())
            {
                var routes = RoutesData.GetEntities();
                _dbContext.Routes.AddRange(routes);
                _dbContext.SaveChanges();

                var pairs = DesriptionsAdjectivePairsData.GetEntities(routes);
                _dbContext.DescriptionAdjectivePairs.AddRange(pairs);
                _dbContext.SaveChanges();
            }
        }
        private static void SeedTable<TEntity>(SeederTemplate<TEntity> tableSeeder) where TEntity : class
        {
            tableSeeder.Seed();
        }
    }
}
