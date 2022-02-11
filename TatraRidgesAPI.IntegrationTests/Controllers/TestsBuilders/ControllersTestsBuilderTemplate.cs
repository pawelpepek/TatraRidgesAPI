using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders
{
    public abstract class ControllersTestsBuilderTemplate
    {
        protected readonly WebApplicationFactory<Startup> _factory;
        protected readonly HttpClient _client;

        protected HttpStatusCode _code;

        protected HttpResponseMessage _response;

        public ControllersTestsBuilderTemplate(WebApplicationFactory<Startup> factory, HttpClient client)
        {
            _factory = factory;
            _client = client;
        }

        public ControllersTestsBuilderTemplate SetStatusCode(HttpStatusCode code)
        {
            _code = code;
            return this;
        }

        public async Task Build()
        {
            //arrange and act
            _response = await ArrangeAndAct();

            //assert
            _response.StatusCode.Should().Be(_code);
            AssertValues();
        }
        protected bool IsStatusCodeOK() => _code == HttpStatusCode.OK && _code == _response.StatusCode;
        protected abstract Task<HttpResponseMessage> ArrangeAndAct();
        protected abstract void AssertValues();
    }
}

