using Microsoft.AspNetCore.Mvc.Testing;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.Helpers;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class MountainPointsUserControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly MountainPointsControllerHelper _helper;
        public MountainPointsUserControllerTests(WebApplicationFactory<Startup> factory)
        : base(factory, "ForPoints", UserRole.User)
        {
            _helper = new MountainPointsControllerHelper(Client, Factory);
        }

        [Fact]
        public async Task Move_WithValidModel_WithUserAutorization_ReturnsUnauthorized()
            => await _helper.Move_WithValidModel_WithouthAdminAuthorized_RetursUnauthorized();
    }
}
