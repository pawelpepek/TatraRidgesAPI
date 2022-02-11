using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.PointsConnections;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class PointsConnectionsUnauthorizedControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        public PointsConnectionsUnauthorizedControllerTests(WebApplicationFactory<Startup> factory)
            : base(factory, "ForConnections", UserRole.None)  {}


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
        public async Task PostNewPointsConnection_WithouthAutorization_WithExistingPoints_ReturnsUnauthorized()
            => await new PostNewPointsConnectionTestsBuilder(Factory, Client).SetIsPointsExists(true)
                                                                    .SetStatusCode(HttpStatusCode.Unauthorized)
                                                                    .Build();

        [Fact]
        public async Task GetNextEmptyRidge_WithouthAutorization_WithExistingOne_RetursUnauthorized()
            => await new GetNextEmptyRidgeTestsBuilder(Factory, Client).SetExistEmptyConnection(true)
                                                                       .SetStatusCode(HttpStatusCode.Unauthorized)
                                                                       .Build();
    }
}
