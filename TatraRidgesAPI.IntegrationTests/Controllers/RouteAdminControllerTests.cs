using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Routes;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class RouteAdminControllerTests : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        public RouteAdminControllerTests(WebApplicationFactory<Startup> factory)
            : base(factory, "ForRoutes", UserRole.Admin) { }


        [Fact]
        public async Task GetParameters_ReturnsOK()
            => await new GetParametersTestsBuilder(Factory, Client).SetStatusCode(HttpStatusCode.OK)
                                                                   .Build();

        [Fact]
        public async Task PostNewRouteBetweenPoints_WithExistingPointsWithouthConnection_ReturnsOK()
            => await new PostNewRouteBetweenPoints(Factory, Client).SetStatusCode(HttpStatusCode.OK)
                                                                   .Build();

        [Fact]
        public async Task PostNewRouteBetweenPoints_WithExistingPointsWithConnection_ReturnsOK()
            => await new PostNewRouteBetweenPoints(Factory, Client).SetConnectionExists()
                                                                   .SetStatusCode(HttpStatusCode.OK)
                                                                   .Build();

        [Fact]
        public async Task PostNewRouteBetweenPointsn_WithExistingPointsWithLoopedConnection_ReturnsConflict()
            => await new PostNewRouteBetweenPoints(Factory, Client).SetPointsConnectionIsLooped()
                                                                   .SetStatusCode(HttpStatusCode.Conflict)
                                                                   .Build();

        [Fact]
        public async Task PostNewRouteBetweenPoints_WithNotExistingPoint_ReturnsNotFound()
            => await new PostNewRouteBetweenPoints(Factory, Client).SetPointNotExists()
                                                                   .SetStatusCode(HttpStatusCode.NotFound)
                                                                   .Build();
    }
}
