using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Net.Http;
using TatraRidges.Model.Entities;
using TatraRidgesAPI.IntegrationTests.Helpers;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Basics
{
    public abstract class ControllerTestsTemplate: IClassFixture<WebApplicationFactory<Startup>>
    {
        public HttpClient Client { get; }
        public WebApplicationFactory<Startup> Factory { get; }

        public ControllerTestsTemplate(WebApplicationFactory<Startup> factory,
            string name, UserRole roleToAuthorisation=UserRole.None)
        {

            Factory = factory
             .WithWebHostBuilder(builder =>
             {
                 builder.ConfigureServices(services =>
                 {
                     var dbContextOptions = services
                     .SingleOrDefault(service => service.ServiceType == typeof(DbContextOptions<TatraDbContext>));

                     if (dbContextOptions != null)
                     {
                         services.Remove(dbContextOptions);
                     }
                     services.AddDbContext<TatraDbContext>(options => options.UseInMemoryDatabase($"tatraDb{name}{roleToAuthorisation}"));
                     if(roleToAuthorisation!=UserRole.None)
                     {
                         services.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
                         services.AddMvc(option => option.Filters.Add(new FakeUserFilter(roleToAuthorisation)));
                     }

                 });
             });
            Client = Factory.CreateClient();
        }
    }
}
