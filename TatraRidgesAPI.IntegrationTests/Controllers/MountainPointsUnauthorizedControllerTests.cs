using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.MountainPoints;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class MountainPointsUnauthorizedControllerTests
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        public MountainPointsUnauthorizedControllerTests(WebApplicationFactory<Startup> factory)
        : base(factory, "ForPoints", UserRole.None) { }

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
            => await new MoveTestsBuilder(Factory, Client).SetValidCoordinates()
                                                          .SetPointInContext(true)
                                                          .SetStatusCode(HttpStatusCode.Unauthorized)
                                                          .Build();

        [Fact]
        public async Task Delete_ExistingPoint_WithouthAutorization_ReturnsUnauthorized()
            => await new DeleteTestsBuilder(Factory, Client).SetPointInContext(true)
                                                            .SetStatusCode(HttpStatusCode.Unauthorized)
                                                            .Build();
    }
}
