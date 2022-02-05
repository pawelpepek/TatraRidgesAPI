namespace TatraRidges.Model.Dtos
{
    public class AddRouteDto
    {
        public int PointId1 { get; set; }
        public int PointId2 { get; set; }
        public int DifficultyValue { get; set; }

        public string DifficultySign { get; set; }
        public bool Rappeling { get; set; }
        public byte RouteType { get; set; }
        public AddGuideDescriptionDto GuideDescription { get; set; }
        public TimeSpan RouteTime { get; set; }
        public List<string> Adjectives { get; set; }

    }
}
