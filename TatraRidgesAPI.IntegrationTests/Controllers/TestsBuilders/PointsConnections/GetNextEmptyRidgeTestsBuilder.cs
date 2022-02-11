using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.PointsConnections
{
    public class GetNextEmptyRidgeTestsBuilder : ControllersTestsBuilderTemplate
    {
        private bool _exist;

        public GetNextEmptyRidgeTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }


        public GetNextEmptyRidgeTestsBuilder SetExistEmptyConnection(bool exist)
        {
            _exist = exist;
            return this;
        }

        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //arrange
            var dbTester = new PointsConnectionTester(_factory);
            if (_exist)
            {
                dbTester.AddNewRidgeConnections(2);
            }
            else
            {
                dbTester.DeleteAllConnectionRidgeWithouthRoutes();
            }
            //act
            return await _client.GetAsync("/api/connection/empty");
        }
        protected override void AssertValues()
        {
            if(IsStatusCodeOK())
            {
                _response.Content.Should().NotBeNull();
            }
        }
    }
}
