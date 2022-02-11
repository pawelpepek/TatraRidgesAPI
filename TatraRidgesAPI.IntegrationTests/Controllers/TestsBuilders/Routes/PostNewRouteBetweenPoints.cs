using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Routes
{
    public class PostNewRouteBetweenPoints : ControllersTestsBuilderTemplate
    {
        private AddRouteDto _model;
        private bool _connectionExists;
        private bool _pointsExists=true;
        private bool _looped;

        public PostNewRouteBetweenPoints(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }

        public PostNewRouteBetweenPoints SetConnectionExists()
        {
            _connectionExists = true;
            return this;
        }
        public PostNewRouteBetweenPoints SetPointNotExists()
        {
            _pointsExists =false;
            return this;
        }
        public PostNewRouteBetweenPoints SetPointsConnectionIsLooped()
        {
            _looped = true;
            return this;
        }
        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //arrange
            SetModel();
            var json = JsonConvert.SerializeObject(_model);

            var httpContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");

            //act
            return await _client.PostAsync("/api/route", httpContent);
        }
        protected override void AssertValues()
        {
            if(IsStatusCodeOK())
            {
                _response.Content.Should().NotBeNull();
            }
        }

        private void SetModel()
        {
            var (pointId1, pointId2) = _connectionExists || _looped
                                        ? GetConnectedPoints()
                                        : GetPointsWithouthConnection(_pointsExists);

            _model = AddRouteDtoCreator.GetSample(pointId1, pointId2);
        }

        private (int pointId1, int pointId2) GetConnectedPoints()
        {
            return _looped? GetLoppedPoints(): GetPointsWithConnection();
        }

        private (int pointId1, int pointId2) GetLoppedPoints()
        {
            var tester = new PointsConnectionTester(_factory);
            return tester.GetLoppedPoints();
        }

        private (int pointId1, int pointId2) GetPointsWithConnection()
        {
            var tester = new PointsConnectionTester(_factory);
            var connection = tester.AddNewRidgeConnections(2)[0];

            return (connection.PointId1, connection.PointId2);
        }

        private (int pointId1, int pointId2) GetPointsWithouthConnection(bool exists)
        {
            var tester = new MountainPointsTester(_factory);

            var point1 =tester.GetMountainPoint(true);
            var point2 = tester.GetMountainPoint(exists);

            return (point1.Id, point2.Id);
        }
    }
}
