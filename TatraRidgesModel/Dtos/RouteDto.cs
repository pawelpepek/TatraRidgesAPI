namespace TatraRidges.Model.Dtos
{
    public class RouteDto
    {
        public long Id { get; set; }
        public bool ConsistentDirection { get; set; }
        public decimal DifficultyValue { get; set; }
        public string Difficulty { get; set; }
        public bool Rappeling { get; set; }
        public RouteTypeDto RouteType { get; set; }
        public GuideDescriptionDto GuideDescription { get; set; }
        public int Rank { get; set; }

        public System.TimeSpan RouteTime { get; set; }
        public List<AdjectiveDto> DescriptionAdjective{ get; set; }
    }
}
