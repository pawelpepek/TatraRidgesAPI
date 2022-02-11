using Microsoft.AspNetCore.Mvc.Testing;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.MountainPoints;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class MountainPointsAdminControllerTests
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        public MountainPointsAdminControllerTests(WebApplicationFactory<Startup> factory)
        : base(factory, "ForPoints", UserRole.Admin) { }

        public static IEnumerable<object[]> GetValidPointGPS() => DataForMoveMountainPoints.GetValidPointGPS();
        public static IEnumerable<object[]> GetInvalidPointGPS() => DataForMoveMountainPoints.GetInvalidPointGPS();

        [Theory]
        [MemberData(nameof(GetValidPointGPS))]
        public async Task Move_WithValidModel_ReturnsOK(PointGPSDto pointGPS)
            => await new MoveTestsBuilder(Factory, Client).SetCoordinates(pointGPS)
                                                          .SetPointInContext(true)
                                                          .SetStatusCode(HttpStatusCode.OK)
                                                          .Build();

        [Theory]
        [MemberData(nameof(GetInvalidPointGPS))]
        public async Task Move_WithInvalidModel_ReturnsRequestedRangeNotSatisfiable(PointGPSDto pointGPS)
            => await new MoveTestsBuilder(Factory, Client).SetCoordinates(pointGPS)
                                                          .SetPointInContext(true)
                                                          .SetStatusCode(HttpStatusCode.RequestedRangeNotSatisfiable)
                                                          .Build();
        [Fact]
        public async Task Delete_ExistingPoint_ReturnsOK()
              => await new DeleteTestsBuilder(Factory, Client).SetPointInContext(true)
                                                              .SetStatusCode(HttpStatusCode.OK)
                                                              .Build();

        [Fact]
        public async Task Delete_NotExistingPoint_ReturnsNotFound()
              => await new DeleteTestsBuilder(Factory, Client).SetPointInContext(false)
                                                              .SetStatusCode(HttpStatusCode.NotFound)
                                                              .Build();
    }
}
