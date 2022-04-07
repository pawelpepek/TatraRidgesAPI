using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers.RouteSummary.Additional
{
    internal class AdditionalDescriptionsCreatorTemplate
    {
        protected readonly List<RouteDto> _routes;
        protected readonly TatraDbContext _dbContext;
        private readonly RowsDescriptionBuilder _builder = new();

        public bool Warnings { get; set; }


        public AdditionalDescriptionsCreatorTemplate(TatraDbContext dbContext, List<RouteDto> routes)
        {
            _routes = routes;
            _dbContext = dbContext;

        }

        public string GetText()
        {
            return GetRows().AddHeader(Header(Warnings))
                            .Build();
        }

        protected virtual RowsDescriptionBuilder GetRows()
        {
            return GetDescription();
        }

        protected List<Route> GetRoutes()
        {
            return _routes.Select(r => _dbContext.Routes.First(dr => dr.Id == r.Id))
                          .ToList();
        }

        private RowsDescriptionBuilder GetDescription()
        {
            var routes = GetRoutes();

            var descriptions = routes.SelectMany(r => GetDescriptions(r, Warnings))
                                     .Distinct()
                                     .ToList();
            return _builder.AddRows(descriptions);
        }

        private static List<string> GetDescriptions(Route route, bool warnings)
        {
            if (route.AdditionalDescriptions == null)
            {
                return new List<string>();
            }

            return route.AdditionalDescriptions.Where(r => r.Warning == warnings)
                                               .Select(r => r.Description)
                                               .ToList();
        }

        private static string Header(bool warning)
        {
            return warning ? "zagrożenia" : "dodatkowe informacje";
        }
    }
}
