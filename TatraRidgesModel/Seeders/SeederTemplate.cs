using TatraRidges.Model.Entities.Helpers;

namespace TatraRidges.Model.Seeders
{
    internal abstract class SeederTemplate<TEntity> where TEntity : class
    {
        private readonly TatraDbContext _dbContext;

        public SeederTemplate(TatraDbContext dbContext) => _dbContext = dbContext;
        public void Seed()
        {
            if (_dbContext.Database.CanConnect())
            {
                var entities = GetEntities();
                DataSaver.SaveWhenEmpty(_dbContext, entities);
            }
        }
        public abstract List<TEntity> GetEntities();
    }
}
