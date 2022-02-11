using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Helpers.DataContext
{
    public class TatraDbTester
    {
        protected readonly WebApplicationFactory<Startup> _factory;

        public TatraDbTester(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        public IServiceScope GetScope()
        {
            var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>();
            return scopeFactory.CreateScope();
        }
        public static TatraDbContext GetDbContext(IServiceScope scope)
        {
            return scope.ServiceProvider.GetService<TatraDbContext>();
        }
    }
}
