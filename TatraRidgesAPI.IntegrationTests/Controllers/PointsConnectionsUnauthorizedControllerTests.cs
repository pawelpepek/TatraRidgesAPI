using Microsoft.AspNetCore.Mvc.Testing;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class PointsConnectionsUnauthorizedControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        public PointsConnectionsUnauthorizedControllerTests(WebApplicationFactory<Startup> factory)
      : base(factory, "ForConnections", UserRole.None) { }
    }
}
