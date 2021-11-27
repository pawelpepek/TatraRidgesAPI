namespace TatraRidges.Model.Seeders.ExampleData
{
    internal static class DesriptionsAdjectivePairsData
    {
        public static List<DescriptionAdjectivePair> GetEntities(List<Route> routes)
        {
            return new List<DescriptionAdjectivePair>()
            {
                new DescriptionAdjectivePair()
                {
                    RouteId=routes[0].Id,
                    AdjectiveId="_e"
                },
                new DescriptionAdjectivePair()
                {
                    RouteId=routes[0].Id,
                    AdjectiveId="dz"
                },
                new DescriptionAdjectivePair()
                {
                    RouteId=routes[2].Id,
                    AdjectiveId="_e"

                },
                new DescriptionAdjectivePair()
                {
                    RouteId=routes[2].Id,
                    AdjectiveId="dc"
                },
                new DescriptionAdjectivePair()
                {
                    RouteId=routes[3].Id,
                    AdjectiveId="_e"

                },
                new DescriptionAdjectivePair()
                {
                    RouteId=routes[3].Id,
                    AdjectiveId="dc"
                }
            };
        }
    }
}
