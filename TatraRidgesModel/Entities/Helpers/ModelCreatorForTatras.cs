using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Entities.Helpers.ModelCreators;

namespace TatraRidges.Model.Entities.Helpers;

internal static class ModelCreatorForTatras
{
    internal static void Create(ModelBuilder modelBuilder)
    {
        AdjectiveModelCreator.Create(modelBuilder);
        DifficultyModelCreator.Create(modelBuilder);
        DifficultyDetailModelCreator.Create(modelBuilder);
        GuideModelCreate.Create(modelBuilder);
        GuideDescriptionModelCreator.Create(modelBuilder);
        MountainPointModelCreator.Create(modelBuilder);
        PointsConnectionModelCreator.Create(modelBuilder);
        PointTypeModelCreator.Create(modelBuilder);
        RouteTypeModelCreator.Create(modelBuilder);
        RouteModelCreator.Create(modelBuilder);
        DescriptionPairModelCreator.Create(modelBuilder);
        UserModelCreator.Create(modelBuilder);
        RoleModelCreator.Create(modelBuilder);
        AdditionalDescriptionModelCreator.Create(modelBuilder);
    }
}

