using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.Helpers;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.PointsConnections;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class PointsConnectionsAdminControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly PointsConnectioinsControllerHelper _helper;

        public PointsConnectionsAdminControllerTests(WebApplicationFactory<Startup> factory)
      : base(factory, "ForConnections", UserRole.Admin) 
        {
            _helper = new PointsConnectioinsControllerHelper(Client, Factory);
        }

        [Theory]
        [InlineData(false)]
        [InlineData(true)]
        public async Task PostNewPointsConnection_WithouthAutorization_WithValidData_ReturnsOK(bool ridge)
            => await _helper.PostNewPointsConnection_WithValidData_ReturnsOK(ridge, true);

        [Fact]
        public async Task GetNextEmptyRidge_WithAdminAutorization_WithExistingOne_RetursOK()
            => await new GetNextEmptyRidgeTestsBuilder(Factory, Client).SetExistEmptyConnection(true)
                                                                       .SetStatusCode(HttpStatusCode.OK)
                                                                       .Build();
        [Fact]
        public async Task GetNextEmptyRidge_WithAdminAutorization_WithoutExistingEmptyOne_RetursOK()
             => await new GetNextEmptyRidgeTestsBuilder(Factory, Client).SetExistEmptyConnection(false)
                                                                        .SetStatusCode(HttpStatusCode.NotFound)
                                                                        .Build();
    }
}
