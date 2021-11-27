namespace TatraRidges.Model.Seeders.ParametersData
{
    internal class RouteTypesData : SeederTemplate<RouteType>
    {
        public RouteTypesData(TatraDbContext context) : base(context) { }
        public override List<RouteType> GetEntities()
        {
            return new List<RouteType>()
            {
                new RouteType()
                {
                    Id = 1,
                    Name = "Ściśle granią",
                    Rank = 2
                },
                new RouteType()
                {
                    Id = 2,
                    Name = "Prawie ściśle granią",
                    Rank = 1
                },
                new RouteType()
                {
                    Id = 3,
                    Name = "Obchodząc grań",
                    Rank = 3
                }
            };
        }
    }
}
