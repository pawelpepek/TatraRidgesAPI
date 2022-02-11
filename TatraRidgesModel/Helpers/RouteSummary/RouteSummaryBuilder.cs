using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public class RouteSummaryBuilder
    {
        private readonly List<RouteDto?> _routes;
        private readonly TatraDbContext _dbContext;

        private readonly RouteSummary _routeSummary;

        public RouteSummaryBuilder(List<RouteDto?> routes)
        {
            _routes = routes;
            _routeSummary = new RouteSummary();
        }

        public RouteSummaryBuilder(TatraDbContext dbContext, List<RouteDto?> routes) : this(routes)
        {
            _dbContext = dbContext;
        }
        public RouteSummaryBuilder SetIsEmptyRoad()
        {
            _routeSummary.IsEmptyRoute = _routes.Any(r => r == null);
            return this;
        }
        public RouteSummaryBuilder SetIsConsistentDirection()
        {
            _routeSummary.IsConsistentDirection = _routes.All(r => r == null || r.ConsistentDirection);
            return this;
        }
        public RouteSummaryBuilder SetRouteTime()
        {
            _routeSummary.RouteTime = new TimeSpan(GetAllTicks());
            return this;
        }
        public RouteSummaryBuilder SetDifficulties()
        {
            var difficultyCounter = new RouteDifficultyCounter(_dbContext, GetNotEmptyRoutes());

            _routeSummary.AvarageDifficulty = difficultyCounter.AvarageDifficulty;
            _routeSummary.MaxDifficulty = difficultyCounter.MaxDifficulty;

            return this;
        }

        public RouteSummaryBuilder SetRank()
        {
            var exactRank = GetAllTicks() == 0 ? 0
                            : GetNotEmptyRoutes().Sum(r => r.Rank * r.RouteTime.Ticks) / Convert.ToDecimal(GetAllTicks());

            _routeSummary.Rank = Convert.ToInt32(Math.Round(exactRank, 0));

            return this;
        }

        public RouteSummaryBuilder SetRappeling()
        {
            _routeSummary.Rappeling = GetNotEmptyRoutes().Any(r => r.Rappeling);
            return this;
        }

        public RouteSummaryBuilder SetDescription()
        {
            _routeSummary.Description = DescriptionCreator.GetDescription(_dbContext, GetNotEmptyRoutes());
            return this;
        }

        public RouteSummary Build() => _routeSummary;

        private long GetAllTicks() => RouteTimeCounter.TicksCount(GetNotEmptyRoutes());
        private List<RouteDto> GetNotEmptyRoutes() => _routes.Where(r => r != null).ToList();

    }
}
