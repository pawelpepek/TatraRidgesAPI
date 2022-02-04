using TatraRidges.Model.Dtos;
using TatraRidges.Model.Procedures;

namespace TatraRidges.Model.Helpers
{
    public class RouteSummary
    {
        private readonly long _allTicks;
        private readonly TatraDbContext _dbContext;

        public bool IsEmptyRoad { get; }
        public bool IsConsistentDirection { get; }
        public DifficultyDto MaxDifficulty { get; }
        public DifficultyDto AvarageDifficulty { get; }
        public bool Rappeling { get; }
        public TimeSpan RouteTime { get; }
        public string Description { get; } = "";
        public int Rank { get; }

        public RouteSummary(List<RouteDto?> routes, TatraDbContext dbContext)
        {
            _dbContext = dbContext;

            var notEmptyRoutes = routes.Where(r => r != null).OfType<RouteDto>().ToList();

            IsEmptyRoad = routes.Any(r => r == null);

            Rappeling = notEmptyRoutes.Any(r => r.Rappeling);

            IsConsistentDirection = notEmptyRoutes.Any(r => r.ConsistentDirection);

            _allTicks = notEmptyRoutes.Sum(r => r.RouteTime.Ticks);
            RouteTime = new TimeSpan(_allTicks);

            var maxDifficultyValue = notEmptyRoutes.Max(r => r.DifficultyValue);
            var avarageDifficultyValue = notEmptyRoutes.Sum(r => r.DifficultyValue * r.RouteTime.Ticks) / _allTicks;

            var diffHandler = new DifficultyHandler(dbContext);

            MaxDifficulty = diffHandler.GetTextFromDecimal(maxDifficultyValue);
            AvarageDifficulty = diffHandler.GetTextFromDecimal(avarageDifficultyValue);

            var exactRank = GetFactorTikcs(notEmptyRoutes.Sum(r => r.Rank * r.RouteTime.Ticks));

            Rank = Convert.ToInt32(Math.Round(exactRank, 0));

            Description = GetDescription(notEmptyRoutes);
        }

        private string GetDescription(List<RouteDto> routes)
        {
            var groups = _dbContext.Adjectives.GroupBy(a => a.Id.Substring(1))
                                              .Select(g => g.First().Id.Substring(1))
                                              .ToList();

            var groupsData = groups.Select(g => new AdjectiveGroupData(g, _dbContext.Adjectives.Where(a => a.Id.Substring(1) == g).ToList(), _allTicks))
                                   .ToList();

            foreach (var route in routes)
            {
                var adjectives = route.DescriptionAdjective.Select(a => _dbContext.Adjectives.First(o => o.Id == a.Id))
                                                           .ToList();
                foreach (var adjective in adjectives)
                {
                    var group = groupsData.First(g => g.Id == adjective.Id[1..]);
                    group.AddTimeAndRank(route.RouteTime.Ticks, adjective);
                }
            }

            var texts = groupsData.Where(g => !g.IsToLower()).Select(g => g.GetText()).ToList();

            var partsDescriptions = texts.Where(t => t.StartsWith("częściowo")).Select(t=>t.Replace("częściowo ",""));
            var mostDescriptions = texts.Where(t => !t.StartsWith("częściowo"));

            var partsText = partsDescriptions.Any()? "częściowo " + string.Join(", ", partsDescriptions):"";
            var andText = mostDescriptions.Any() && partsDescriptions.Any() ? "oraz" : "";
            var mostText =string.Join(", ", mostDescriptions);

            var parts = new string[] { "Droga", mostText, andText, partsText }.Where(t=>t!="");

            return String.Join(" ",parts);
        }
        private decimal GetFactorTikcs(long value) => value / Convert.ToDecimal(_allTicks);
    }
}
