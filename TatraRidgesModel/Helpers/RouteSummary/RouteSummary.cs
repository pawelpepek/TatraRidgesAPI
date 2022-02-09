using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public class RouteSummary
    {
        public bool IsEmptyRoad { get; internal set; }
        public bool IsConsistentDirection { get; internal set; }
        public TimeSpan RouteTime { get; internal set; }
        public DifficultyDto MaxDifficulty { get; internal set; }
        public DifficultyDto AvarageDifficulty { get; internal set; }
        public int Rank { get; internal set; }
        public bool Rappeling { get; internal set; }
        public string Description { get; internal set; } 
    }
}
