namespace TatraRidges.Model.Dtos
{
    public class RidgeWithRoutesDto
    {
        public int PointId1 { get; set; }
        public int PointId2 { get; set; }

        public List<RouteDto> Routes { get; set; }
    }
}
