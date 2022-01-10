using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Helpers
{
    public class PointsConnectioinsControllerHelper : ControllerHelperTemplate
    {
        public PointsConnectioinsControllerHelper(HttpClient client, WebApplicationFactory<Startup> factory)
            : base(client, factory) { }


        public async Task PostNewPointsConnection_WithValidData_ReturnsOK(bool ridge, bool authorized)
        {
            var model = new PointsConnectionCreateDto()
            {
                PointId1 = new MountainPointsTester(Factory).AddNewMountainPoint().Id,
                PointId2 = new MountainPointsTester(Factory).AddNewMountainPoint().Id,
                Ridge = ridge,
            };

            var expectedStatusCode= authorized ? HttpStatusCode.OK: HttpStatusCode.Unauthorized;

            await PostNewPointsConnection_ReturnsCode(model, expectedStatusCode);
        }
        private async Task PostNewPointsConnection_ReturnsCode(PointsConnectionCreateDto model, HttpStatusCode code)
        {
            //arrange

            var json = JsonConvert.SerializeObject(model);

            var httpContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");

            //act
            var response = await Client.PutAsync("/api/connection", httpContent);

            //assert
            response.StatusCode.Should().Be(code);

            if (code == HttpStatusCode.OK && code == response.StatusCode)
            {
                bool isInBase=new PointsConnectionTester(Factory).IsConnectionInDataContext(model);

                isInBase.Should().BeTrue();
            }
        }
    }
}
