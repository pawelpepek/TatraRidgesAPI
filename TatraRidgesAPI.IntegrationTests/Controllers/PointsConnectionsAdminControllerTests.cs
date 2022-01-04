using Microsoft.AspNetCore.Mvc.Testing;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class PointsConnectionsAdminControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        public PointsConnectionsAdminControllerTests(WebApplicationFactory<Startup> factory)
      : base(factory, "ForConnections", UserRole.Admin) { }
    }
}
