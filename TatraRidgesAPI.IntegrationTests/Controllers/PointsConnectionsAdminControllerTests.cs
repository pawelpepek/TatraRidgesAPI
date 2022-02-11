using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.PointsConnections;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class PointsConnectionsAdminControllerTests
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {

        public PointsConnectionsAdminControllerTests(WebApplicationFactory<Startup> factory)
            : base(factory, "ForConnections", UserRole.Admin) { }

        [Theory]
        [InlineData(false)]
        [InlineData(true)]
        public async Task PostNewPointsConnection_WithExistingPoints_ReturnsOK(bool ridge)
            => await new PostNewPointsConnectionTestsBuilder(Factory, Client).SetIsPointsExists(true)
                                                                             .SetIsRidge(ridge)
                                                                             .SetStatusCode(HttpStatusCode.OK)
                                                                             .Build();

        [Fact]
        public async Task GetNextEmptyRidge_WithExistingOne_RetursOK()
            => await new GetNextEmptyRidgeTestsBuilder(Factory, Client).SetExistEmptyConnection(true)
                                                                       .SetStatusCode(HttpStatusCode.OK)
                                                                       .Build();
        [Fact]
        public async Task PostNewPointsConnection_MakeLoopConnection_ReturnsConflict()
            => await new PostNewPointsConnectionTestsBuilder(Factory, Client).SetIsPointsExists(true)
                                                                             .SetPointsConnectionIsLooped()
                                                                             .SetStatusCode(HttpStatusCode.Conflict)
                                                                             .Build();
    }
}
