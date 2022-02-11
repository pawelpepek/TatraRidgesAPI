using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.MountainPoints
{
    public class DeleteTestsBuilder : PointsTestsBuilderTemplate
    {
        public DeleteTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }

        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            return await _client.DeleteAsync("/api/point/" + _point.Id);
        }

        protected override void AssertValues()
        {
            
        }
    }
}