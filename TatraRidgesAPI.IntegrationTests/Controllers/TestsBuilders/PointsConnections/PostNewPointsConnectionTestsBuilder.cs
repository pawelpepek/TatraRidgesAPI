using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Helpers;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.PointsConnections
{
    public class PostNewPointsConnectionTestsBuilder : ControllersTestsBuilderTemplate
    {
        private bool _ridge;
        private bool _exists;
        private bool _looped;

        private PointsConnectionCreateDto _model;

        public PostNewPointsConnectionTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }


        public PostNewPointsConnectionTestsBuilder SetIsRidge(bool ridge)
        {
            _ridge = ridge;
            return this;
        }
        public PostNewPointsConnectionTestsBuilder SetIsPointsExists(bool exists)
        {
            _exists=exists;
            return this;
        }
        public PostNewPointsConnectionTestsBuilder SetPointsConnectionIsLooped()
        {
            _looped=true;
            return this;
        }

        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //arrange
            SetModel();

            var httpContent = _model.ToJsonHttpContent();

            //act
            return await _client.PostAsync("/api/connection", httpContent);
        }
        protected override void AssertValues()
        {
            if (IsStatusCodeOK())
            {
                bool isInBase = new PointsConnectionTester(_factory).IsConnectionInDataContext(_model);

                isInBase.Should().BeTrue();
            }
        }

        private void SetModel()
        {
            if(_looped)
            {
                var tester = new PointsConnectionTester(_factory);
                var (pointId1, pointId2)= tester.GetLoppedPoints();

                _model = new PointsConnectionCreateDto()
                {
                    PointId1 =pointId1,
                    PointId2 = pointId2,
                    Ridge = true,
                };
            }
            else
            {
                _model = new PointsConnectionCreateDto()
                {
                    PointId1 = new MountainPointsTester(_factory).GetMountainPoint(true).Id,
                    PointId2 = new MountainPointsTester(_factory).GetMountainPoint(_exists).Id,
                    Ridge = _ridge,
                };
            }
        }
    }
}