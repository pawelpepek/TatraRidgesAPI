using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Controllers.Helpers.Structures;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.MountainPoints
{
    public class MoveTestsBuilder : PointsTestsBuilderTemplate
    {
        private readonly PointGPSDto _validCoordinates = new() { Latitude = 49.15m, Longitude = 19.92m };

        private PointGPSDto _coordinates;

        public MoveTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }

        public MoveTestsBuilder SetCoordinates(PointGPSDto coordinates)
        {
            _coordinates = coordinates;
            return this;
        }
        public MoveTestsBuilder SetValidCoordinates()
        {
            _coordinates = _validCoordinates;
            return this;
        }

        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //arrange
            var model = new PointMoveModel
            {
                MountainPointId = _point.Id,
                Coordinates = _coordinates,
            };

            var json = JsonConvert.SerializeObject(model.Coordinates);

            var httpContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");

            //act
            return await _client.PutAsync("/api/point/" + _point.Id, httpContent);
        }
        protected override void AssertValues()
        {
            if (IsStatusCodeOK())
            {
                var changedPoint = new MountainPointsTester(_factory)
                                    .GetMountainPoint(_point.Id);

                changedPoint.Latitude.Should().Be(_coordinates.Latitude);
                changedPoint.Longitude.Should().Be(_coordinates.Longitude);
            }
        }
    }
}
