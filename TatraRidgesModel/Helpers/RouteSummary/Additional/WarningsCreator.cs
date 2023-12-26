using TatraRidges.Model.Dtos;
using TatraRidges.Model.Interfaces;

namespace TatraRidges.Model.Helpers.RouteSummary.Additional
{
    internal class WarningsCreator:AdditionalDescriptionsCreatorTemplate
    {
        public WarningsCreator(ICashScopeService cash, List<RouteDto> routes) : base(cash, routes)
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
