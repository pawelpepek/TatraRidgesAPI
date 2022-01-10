using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Helpers.DataContext
{
    public static class DataTemplates
    {
        internal static MountainPoint GetMountainPointTemplate(string name = "test")
        {
            return new MountainPoint()
            {
                Name = name,
                AlternativeName = name,
                Evaluation = 2000,
                Latitude = 49.12m,
                Longitude = 19.91m,
                PointTypeId = 1,
                PrecisedEvaluation = true,
                WikiAddress = $"\\{name}",
                WikiLatitude = 49.12m,
                WikiLongitude = 19.91m
            };
        }
    }
}
