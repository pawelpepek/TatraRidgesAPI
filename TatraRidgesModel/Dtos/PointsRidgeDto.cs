namespace TatraRidges.Model.Dtos
{
    public class PointsRidgeDto
    {
        public long Id { get; set; }
        public int PointId1 { get; set; }
        public int PointId2 { get; set; }

        public PointGPSDto PointFrom { get; set; }
        public PointGPSDto PointTo { get; set; }
    }
}
