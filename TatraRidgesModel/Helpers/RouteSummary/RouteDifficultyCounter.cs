using TatraRidges.Model.Dtos;
using TatraRidges.Model.Interfaces;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public class RouteDifficultyCounter
    {
        private readonly long _allTicks;

        public DifficultyDto MaxDifficulty { get; }
        public DifficultyDto AvarageDifficulty { get; }

        public RouteDifficultyCounter(ICashScopeService cash, List<RouteDto> routes)
        {
            _allTicks = routes.Sum(r => r.RouteTime.Ticks);

            var maxDifficultyValue = routes.Any()?routes.Max(r => r.DifficultyValue):0;
            var avarageDifficultyValue = routes.Any() ? routes.Sum(r => r.DifficultyValue * r.RouteTime.Ticks) / _allTicks:0;

            var diffHandler = new DifficultyHandler(cash);

            MaxDifficulty = diffHandler.GetTextFromDecimal(maxDifficultyValue);
            AvarageDifficulty = diffHandler.GetTextFromDecimal(avarageDifficultyValue);
        }
    }
}
