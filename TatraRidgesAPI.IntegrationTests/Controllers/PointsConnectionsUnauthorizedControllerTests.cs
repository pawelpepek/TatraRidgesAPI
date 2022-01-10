using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.Helpers;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class PointsConnectionsUnauthorizedControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly PointsConnectioinsControllerHelper _helper;

        public PointsConnectionsUnauthorizedControllerTests(WebApplicationFactory<Startup> factory)
      : base(factory, "ForConnections", UserRole.None) 
        {
            _helper = new PointsConnectioinsControllerHelper(Client, Factory);
        }


        [Fact]
        public async Task GetAllRidges_ReturnsOKResult()
        {
            //arrange

            //act
            var response = await Client.GetAsync("/api/connection");

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task PostNewPointsConnection_WithValidData_ReturnsUnauthorize()
        =>  await _helper.PostNewPointsConnection_WithValidData_ReturnsOK(true, false);
    }
}
