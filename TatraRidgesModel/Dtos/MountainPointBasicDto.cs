namespace TatraRidges.Model.Dtos
{
    public class MountainPointBasicDto
    {
        public int Id { get; set; }
        public byte PointTypeId { get; set; }
        public string PointTypeName{ get; set; }
        public string Name { get; set; }
        public string AlternativeName { get; set; }
        public short? Evaluation { get; set; }
        public bool PrecisedEvaluation { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
