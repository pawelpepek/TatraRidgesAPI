using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers.RouteSummary.Additional;
using TatraRidges.Model.Interfaces;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    public class RouteSummaryBuilder
    {
        private readonly List<RouteDto> _routes;
        private readonly ICashScopeService _cash;

        private readonly RouteSummary _routeSummary;

        public RouteSummaryBuilder()
        {
            _routes = new List<RouteDto>();
            _routeSummary = new RouteSummary();
        }

        public RouteSummaryBuilder(List<RouteDto> routes):this()
        {
            _routes = routes;
        }

        public RouteSummaryBuilder( List<RouteDto> routes, ICashScopeService cash) : this(routes)
        {
            _cash = cash;
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
            var difficultyCounter = new RouteDifficultyCounter(_cash, GetNotEmptyRoutes());

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
            _routeSummary.Description = DescriptionCreator.GetDescription(_cash, GetNotEmptyRoutes());
            return this;
        }

        public RouteSummaryBuilder SetWarnings()
        {
            _routeSummary.Warning = new WarningsCreator(_cash, GetNotEmptyRoutes()).GetText();
            return this;
        }
        public RouteSummaryBuilder SetInfo()
        {
            _routeSummary.Info = new AdditionalDescriptionsCreatorTemplate(_cash, GetNotEmptyRoutes()).GetText();
            return this;
        }

        public RouteSummary Build() => _routeSummary;

        private long GetAllTicks() => RouteTimeCounter.TicksCount(GetNotEmptyRoutes());
        private List<RouteDto> GetNotEmptyRoutes() => _routes.Where(r => r != null).ToList();

    }
}
