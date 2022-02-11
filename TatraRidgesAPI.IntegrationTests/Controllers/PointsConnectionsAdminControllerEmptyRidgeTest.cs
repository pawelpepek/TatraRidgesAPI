using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.PointsConnections;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class PointsConnectionsAdminControllerEmptyRidgeTest
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {

        public PointsConnectionsAdminControllerEmptyRidgeTest(WebApplicationFactory<Startup> factory)
            : base(factory, "ForConnectionsEmpty", UserRole.Admin) { }

        [Fact]
        public async Task GetNextEmptyRidge_WithAdminAutorization_WithoutExistingEmptyOne_RetursNotFound()
             => await new GetNextEmptyRidgeTestsBuilder(Factory, Client).SetExistEmptyConnection(false)
                                                                        .SetStatusCode(HttpStatusCode.NotFound)
                                                                        .Build();
    }
}
