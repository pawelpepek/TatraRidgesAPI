using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class RouteControllesTests:IClassFixture<WebApplicationFactory<Startup>>
    {
        protected readonly HttpClient _client;
        public RouteControllesTests(WebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });
        }

        [Theory]
        [InlineData(0,1,false)]
        [InlineData(25, 0, false)]
        //[InlineData(25, 36, true)]
        public async void GetRidgeBetweenPoints_ReturnsOKResult(int point1, int point2, bool connected)
        {
            //arrange

            //act
            var response = await _client.GetAsync($"/api/route?from={point1}&to={point2}");

            //assert
            var statusCode = connected ? System.Net.HttpStatusCode.OK : System.Net.HttpStatusCode.NotFound;
            response.StatusCode.Should().Be(statusCode);
        }
    }
}
