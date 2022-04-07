using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers.RouteSummary.Additional
{
    internal class WarningsCreator:AdditionalDescriptionsCreatorTemplate
    {
        public WarningsCreator(TatraDbContext dbContext, List<RouteDto> routes) : base(dbContext, routes)
        {
            Warnings = true;
        }

        protected override RowsDescriptionBuilder GetRows()
        {
            var builder = base.GetRows();
            var routes = GetRoutes();

            var text = WarningsAdjectives.GetText(routes);

            if(text.Any())
            {
                builder.AddRows(text);
            }
            return builder;
        }
    }
}
