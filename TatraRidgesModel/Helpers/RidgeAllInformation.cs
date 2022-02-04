using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers
{
    public class RidgeAllInformation
    {
        public List<RidgeWithRoutesDto> RidgesContainer {get;}
        public RouteSummary InitalRouteSummary { get; }

        public RidgeAllInformation(List<RidgeWithRoutesDto> ridgeContainer, TatraDbContext dbContext)
        {
            RidgesContainer = ridgeContainer;

            var initalRoutes = ridgeContainer.Select(r => r.Routes.Any() ? r.Routes[0]: null).ToList();

            InitalRouteSummary = new RouteSummary(initalRoutes, dbContext);
        }

    }
}
