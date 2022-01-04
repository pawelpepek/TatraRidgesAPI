using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Controllers.Helpers.Structures;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Helpers
{
    public class MountainPointsControllerHelper: ControllerHelperTemplate
    {
        public MountainPointsControllerHelper(HttpClient client, WebApplicationFactory<Startup> factory)
            :base(client, factory){}

        public async Task Move_WithValidModel_WithouthAdminAuthorized_RetursUnauthorized()
            => await Move_WithValidModel_AuthorizedOK(false);

        private async Task Move_WithValidModel_AuthorizedOK(bool authorized)
        {
            var coordinates = new PointGPSDto() { Latitude = 49.15m, Longitude = 19.92m };
            var statusCode = authorized ? HttpStatusCode.OK : HttpStatusCode.Unauthorized;

            await Move_ExistingPointId_WithCoordinates_ReturnsCode(coordinates, statusCode);
        }

        public async Task Move_ExistingPointId_WithCoordinates_ReturnsCode(PointGPSDto coordinates, HttpStatusCode code)
        {
            var model = new PointMoveModel
            {
                MountainPointId = Seeder.AddNewMountainPoint().Id,
                Coordinates = coordinates,
            };
            await Move_WithPointMoveModel_ReturnsCode(model, code);
        }

        private async Task Move_WithPointMoveModel_ReturnsCode(PointMoveModel model, HttpStatusCode code)
        {
            //arrange

            var json = JsonConvert.SerializeObject(model.Coordinates);

            var httpContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");

            //act
            var response = await Client.PutAsync("/api/point/" + model.MountainPointId, httpContent);

            //assert
            response.StatusCode.Should().Be(code);
        }
    }
}
