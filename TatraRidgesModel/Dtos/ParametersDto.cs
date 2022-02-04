namespace TatraRidges.Model.Dtos
{
    public class ParametersDto
    {
        public List<AdjectiveDto> Adjectives { get; set; }
        public List<DifficultyDto> Difficulties { get; set; }
        public List<GuideDto> Guides { get; set; }
        public List<RouteTypeDto> RouteTypes { get; set; }
    }
}
