namespace TatraRidges.Model.Dtos
{
    public class MountainPointDto
    {
        public byte PointTypeId { get; set; }
        public string Name { get; set; }
        public short? Evaluation { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
