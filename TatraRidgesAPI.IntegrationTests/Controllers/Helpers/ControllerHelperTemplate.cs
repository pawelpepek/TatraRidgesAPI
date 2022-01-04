
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using TatraRidgesAPI.IntegrationTests.Helpers;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Helpers
{
    public abstract class ControllerHelperTemplate
    {
        public HttpClient Client { get; }
        public WebApplicationFactory<Startup> Factory { get; }
        public TatraDbTestSeeder Seeder { get; }
        public ControllerHelperTemplate(HttpClient client, WebApplicationFactory<Startup> factory)
        {
            Client = client;
            Factory = factory;
            Seeder = new TatraDbTestSeeder(Factory);
        }
    }
}
