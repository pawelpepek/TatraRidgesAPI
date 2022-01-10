
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using TatraRidgesAPI.IntegrationTests.Helpers;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Helpers
{
    public abstract class ControllerHelperTemplate
    {
        public HttpClient Client { get; }
        public WebApplicationFactory<Startup> Factory { get; }
        public TatraDbTester Tester { get; }
        public ControllerHelperTemplate(HttpClient client, WebApplicationFactory<Startup> factory)
        {
            Client = client;
            Factory = factory;
            Tester = new TatraDbTester(Factory);
        }
    }
}
