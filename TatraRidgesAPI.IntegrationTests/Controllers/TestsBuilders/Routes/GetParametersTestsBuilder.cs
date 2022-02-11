using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Routes
{
    public class GetParametersTestsBuilder : ControllersTestsBuilderTemplate
    {
        public GetParametersTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }

        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //act
            return await _client.GetAsync("/api/route/parameters");
        }
        protected override void AssertValues()
        {
            if(IsStatusCodeOK())
            {
                _response.Content.Should().NotBeNull();
            }
        }
    }
}
