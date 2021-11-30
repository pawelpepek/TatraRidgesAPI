using TatraRidges.Model.Seeders.ParametersData; 
using TatraRidges.Model.Seeders.ExampleData;

namespace TatraRidges.Model.Seeders
{
    public class DbSeeder
    {
        private readonly TatraDbContext _dbContext;
        public DbSeeder(TatraDbContext dbContext) => _dbContext = dbContext;
        public void Seed()
        {
            SeedParameters();
            SeedExample();
        }
        private void SeedParameters()
        {
            SeedOne(new DifficultiesData(_dbContext));
            SeedOne(new DifficultyDetailsData(_dbContext));
            SeedOne(new PointTypesData(_dbContext));
            SeedOne(new AdjectivesData(_dbContext));
            SeedOne(new GuidesData(_dbContext));
            SeedOne(new RouteTypesData(_dbContext));
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
        private static void SeedOne<TEntity>(SeederTemplate<TEntity> seeder) where TEntity : class
        {
            seeder.Seed();
        }
    }
}
