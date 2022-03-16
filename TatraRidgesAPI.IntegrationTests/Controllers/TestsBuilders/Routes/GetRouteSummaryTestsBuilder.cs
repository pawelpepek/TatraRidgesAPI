using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Helpers;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Routes
{
    public class GetRouteSummaryTestsBuilder : ControllersTestsBuilderTemplate
    {
        private bool _routeNotExist;

        public GetRouteSummaryTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }


        public GetRouteSummaryTestsBuilder SetPointNotExist()
        {
            _routeNotExist = true;
            return this;
        }
        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //arrange
            var tester = new RouteTester(_factory);
            var routesIds = tester.GetExistingRoutes();

            if(_routeNotExist)
            {
                routesIds.Add(tester.GetNotExistingRouteIndex());
            }

            var httpContent = routesIds.ToJsonHttpContent();

            //act
            return await _client.PostAsync("/api/route/parts", httpContent);
        }

        protected override void AssertValues()
        {
            if (IsStatusCodeOK())
            {
                _response.Content.Should().NotBeNull();
            }
        }
    }
}
