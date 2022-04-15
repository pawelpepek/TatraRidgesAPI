using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers.RouteSummary;

namespace TatraRidges.Model.Helpers
{
    public class RidgeAllInformation
    {
        public RouteSummary.RouteSummary InitalRouteSummary { get; }
        public List<RidgeWithRoutesDto> RidgesContainer {get;}
        
        public RidgeAllInformation(List<RidgeWithRoutesDto> ridgeContainer, TatraDbContext dbContext)
        {
            RidgesContainer = ridgeContainer;

            var initalRoutes = ridgeContainer.Select(r => r.Routes.Any() ? r.Routes[0]: null)
                                             .ToList();

            InitalRouteSummary = RouteSummaryCreator.Create(initalRoutes,dbContext);
        }

    }
}
