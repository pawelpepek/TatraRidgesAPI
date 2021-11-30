namespace TatraRidges.Model.Dtos
{
    public class RouteTypeDto
    {
        public byte Id { get; set; }
        public string Name { get; set; }
        public byte Rank { get; set; }

        public RouteTypeDto(RouteType routeType)
        {
            Id = routeType.Id;
            Name = routeType.Name;
            Rank = routeType.Rank;
        }
    }
}
