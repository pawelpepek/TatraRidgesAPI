using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Controllers.Basics;
using TatraRidgesAPI.IntegrationTests.Controllers.Helpers;
using TatraRidgesAPI.IntegrationTests.Controllers.Helpers.DataForTests;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class MountainPointsAdminControllerTests 
        : ControllerTestsTemplate, IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly MountainPointsControllerHelper _helper;

        public MountainPointsAdminControllerTests(WebApplicationFactory<Startup> factory)
        : base(factory, "ForPoints", UserRole.Admin) 
        {
            _helper = new MountainPointsControllerHelper(Client, Factory);
        }

        public static IEnumerable<object[]> GetValidPointGPS() => DataForMoveMountainPoints.GetValidPointGPS();
        public static IEnumerable<object[]> GetInvalidPointGPS() => DataForMoveMountainPoints.GetInvalidPointGPS();


        [Fact]
        public async Task GetAll_ReturnsOKResult()
        {
            //arrange

            //act
            var response = await Client.GetAsync("/api/point");

            //assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [MemberData(nameof(GetValidPointGPS))]
        public async Task Move_WithValidModel_WithAdminAutorization_ReturnsOk(PointGPSDto pointGPS)
            => await _helper.Move_ExistingPointId_WithCoordinates_ReturnsCode(pointGPS,HttpStatusCode.OK);

        [Theory]
        [MemberData(nameof(GetInvalidPointGPS))]
        public async Task Move_WithInvalidModel_WithAdminAutorization_ReturnsOk(PointGPSDto pointGPS)
            => await _helper.Move_ExistingPointId_WithCoordinates_ReturnsCode(pointGPS, HttpStatusCode.RequestedRangeNotSatisfiable);

    }
}
