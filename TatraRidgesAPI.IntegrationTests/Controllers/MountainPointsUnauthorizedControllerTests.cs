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
    public class MountainPointsUnauthorizedControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly MountainPointsControllerHelper _helper;
        public MountainPointsUnauthorizedControllerTests(WebApplicationFactory<Startup> factory)
        : base(factory, "ForPoints", UserRole.None) 
        {
            _helper = new MountainPointsControllerHelper(Client, Factory);
        }

        [Fact]
        public async Task GetAll_ReturnsOKResult()
        {
            //arrange

            //act
            var response = await Client.GetAsync("/api/point");

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task Move_WithValidModel_WithouthAutorization_ReturnsUnauthorized()
        =>await _helper.Move_WithValidModel_WithouthAdminAuthorized_RetursUnauthorized();
    }
}
