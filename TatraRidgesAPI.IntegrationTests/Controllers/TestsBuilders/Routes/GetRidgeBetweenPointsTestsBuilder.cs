using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Routes
{
    public class GetRidgeBetweenPointsTestsBuilder : ControllersTestsBuilderTemplate
    {
        private int _connectionCount;
        private bool _pointNotExist;

        public GetRidgeBetweenPointsTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }

        public GetRidgeBetweenPointsTestsBuilder SetPointsConnectionsCount(int count)
        {
            _connectionCount = count;
            return this;
        }
        public GetRidgeBetweenPointsTestsBuilder SetPointNotExist()
        {
            _pointNotExist = true;
            return this;
        }

        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //arrange
            var (pointId1, pointId2) = Arrange();

            //act
            var address = $"/api/route?from={pointId1}&to={pointId2}";
            return await _client.GetAsync(address);
        }
        protected override void AssertValues()
        {
            if (IsStatusCodeOK())
            {
                _response.Content.Should().NotBeNull();
            }
        }

        private (int pointId1, int pointId2) Arrange()
        {
            if (_connectionCount > 0)
            {
                var connections = new PointsConnectionTester(_factory).AddNewRidgeConnections(_connectionCount + 1);

                return (connections[0].PointId1, connections[_connectionCount - 2].PointId2);
            }
            else
            {
                var tester = new MountainPointsTester(_factory);

                var point1 = tester.GetMountainPoint(true);
                var point2 = tester.GetMountainPoint(!_pointNotExist);

                return (point1.Id, point2.Id);
            }
        }
    }
}
