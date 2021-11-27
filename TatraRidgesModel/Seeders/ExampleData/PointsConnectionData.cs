namespace TatraRidges.Model.Seeders.ExampleData
{
    internal static class PointsConnectionData
    {
        public static List<PointsConnection> GetEntities()
        {
            var points = MountainPointsData.GetEntities();
            return new List<PointsConnection>()
            {
                new PointsConnection()
                {
                     MountainPoint1=points[1],
                     MountainPoint2=points[0],
                     Ridge=true
                },
                new PointsConnection()
                {
                     MountainPoint1=points[0],
                     MountainPoint2=points[2],
                     Ridge=true
                },
                new PointsConnection()
                {
                     MountainPoint1=points[0],
                     MountainPoint2=points[3],
                     Ridge=true
                },
                new PointsConnection()
                {
                     MountainPoint1=points[3],
                     MountainPoint2=points[4],
                     Ridge=true
                },
                new PointsConnection()
                {
                     MountainPoint1=points[2],
                     MountainPoint2=points[5],
                     Ridge=true
                }
            };
        }
    }
}
