namespace TatraRidges.Model.Seeders.ExampleData
{
    internal static class RoutesData
    {
        public static List<Route> GetEntities()
        {
            var descriptions =GuideDescriptionsData.GetEntities();
            var connections =PointsConnectionData.GetEntities();

            return new List<Route>()
            {
                new Route()
                {
                    ConsistentDirection=true,
                    DifficultyId=1,
                    DifficultyDetailId=0,
                    GuideDescription=descriptions[0],
                    PointsConnection=connections[0],
                    Rappeling=false,
                    RouteTime= new TimeSpan(0,10,0),
                    RouteTypeId=2
                },
                new Route()
                {
                    ConsistentDirection=true,
                    DifficultyId=0,
                    DifficultyDetailId=1,
                    GuideDescription=descriptions[1],
                    PointsConnection=connections[1],
                    Rappeling=false,
                    RouteTime= new TimeSpan(0,10,0),
                    RouteTypeId=2
                },
                new Route()
                {
                    ConsistentDirection=false,
                    DifficultyId=2,
                    DifficultyDetailId=0,
                    GuideDescription=descriptions[2],
                    PointsConnection=connections[2],
                    Rappeling=false,
                    RouteTime= new TimeSpan(1,15,0),
                    RouteTypeId=2
                },
                new Route()
                {
                    ConsistentDirection=false,
                    DifficultyId=2,
                    DifficultyDetailId=0,
                    GuideDescription=descriptions[3],
                    PointsConnection=connections[3],
                    Rappeling=false,
                    RouteTime= new TimeSpan(1,15,0),
                    RouteTypeId=2
                },
                new Route()
                {
                    ConsistentDirection=false,
                    DifficultyId=1,
                    DifficultyDetailId=0,
                    GuideDescription=descriptions[4],
                    PointsConnection=connections[4],
                    Rappeling=false,
                    RouteTime= new TimeSpan(0,8,0),
                    RouteTypeId=2
                }
            };
        }
    }
}
