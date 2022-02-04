namespace TatraRidges.Model.Dtos
{
    public class MountainPointDto: MountainPointBasicDto
    {
        public int Id { get; set; }
        public string AlternativeName { get; set; }
        public bool PrecisedEvaluation { get; set; }
    }
}
