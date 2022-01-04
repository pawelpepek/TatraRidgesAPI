using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal abstract class ModelCreatorTemplate
    {
        protected readonly ModelBuilder _modelBuilder;

        public ModelCreatorTemplate(ModelBuilder modelBuilder)
        {
            _modelBuilder = modelBuilder;
        }
        public abstract void Create();
    }
}
