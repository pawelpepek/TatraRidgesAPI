using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Routes;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class RouteUnauthorizedControllerTests : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        public RouteUnauthorizedControllerTests(WebApplicationFactory<Startup> factory)
            : base(factory, "ForRoutes", UserRole.None) { }


        [Fact]
        public async Task GetParameters_ReturnsUnauthorized()
            => await new GetParametersTestsBuilder(Factory, Client).SetStatusCode(HttpStatusCode.Unauthorized)
                                                                   .Build();

        [Fact]
        public async Task PostNewRouteBetweenPoints_WithExistingPointsWithouthConnection_ReturnsUnauthorized()
            => await new PostNewRouteBetweenPoints(Factory, Client).SetStatusCode(HttpStatusCode.Unauthorized)
                                                                   .Build();

        [Fact]
        public async Task GetRidgeBetweenPoints_WithExistingPointsWithouthConnection_ReturnsNotFound()
             => await new GetRidgeBetweenPointsTestsBuilder(Factory, Client).SetPointsConnectionsCount(0)
                                                                            .SetStatusCode(HttpStatusCode.NotFound)
                                                                            .Build();
        [Theory]
        [InlineData(2)]
        [InlineData(10)]
        public async Task GetRidgeBetweenPoints_WithExistingPointsWithConnection_ReturnsOK(int pointsCount)
            => await new GetRidgeBetweenPointsTestsBuilder(Factory, Client).SetPointsConnectionsCount(pointsCount)
                                                                           .SetStatusCode(HttpStatusCode.OK)
                                                                           .Build();
        [Fact]
        public async Task GetRidgeBetweenPoints_WithNotExistingPoint_ReturnsNotFound()
             => await new GetRidgeBetweenPointsTestsBuilder(Factory, Client).SetPointNotExist()
                                                                            .SetStatusCode(HttpStatusCode.NotFound)
                                                                            .Build();

        [Fact]
        public async Task GetRouteSummary_WithNotExistingRoute_ReturnsNotFound()
             => await new GetRouteSummaryTestsBuilder(Factory, Client).SetPointNotExist()
                                                                      .SetStatusCode(HttpStatusCode.NotFound)
                                                                      .Build();

        [Fact]
        public async Task GetRouteSummary_WithExistingRoute_ReturnsOk()
             => await new GetRouteSummaryTestsBuilder(Factory, Client).SetStatusCode(HttpStatusCode.OK)
                                                                      .Build();
    }
}
