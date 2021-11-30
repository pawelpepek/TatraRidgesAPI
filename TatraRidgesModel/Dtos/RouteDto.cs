namespace TatraRidges.Model.Dtos
{
    public class RouteDto
    {
        public long PointsConnectionId { get; set; }
        public bool ConsistentDirection { get; set; }
        public decimal DifficultyValue { get; set; }
        public string Difficulty { get; set; }
        public bool Rappeling { get; set; }
        public RouteTypeDto RouteType { get; set; }
        public int GuideDescriptionId { get; set; }
        public int Rank { get; set; }

        public System.TimeSpan RouteTime { get; set; }
        public List<DescriptionAdjectivePairDto> DescriptionAdjective{ get; set; }
    }
}
