
namespace TatraRidges.Model.Dtos
{
    public class MountainPointBasicDto
    {
        public byte PointTypeId { get; set; }
        public string PointTypeName { get; set; }
        public string Name { get; set; }
        public short? Evaluation { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
