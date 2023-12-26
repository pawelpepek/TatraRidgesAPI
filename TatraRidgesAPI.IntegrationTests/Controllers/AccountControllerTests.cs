using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Accounts;
using TatraRidgesAPI.IntegrationTests.Helpers;
using TatraRidgesAPI.Services;
using Xunit;

namespace TatraRidgesAPI.IntegrationTests.Controllers
{
    public class AccountControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        private readonly WebApplicationFactory<Startup> _factory;
        private readonly Mock<IAccountService> _accountServiceMoq = new();

        public AccountControllerTests(WebApplicationFactory<Startup> factory)
        {
            _factory = factory
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        var dbContextOptions = services
                        .SingleOrDefault(service => service.ServiceType 
                        == typeof(DbContextOptions<TatraDbContext>));

                        services.Remove(dbContextOptions);

                        services.AddSingleton(_accountServiceMoq.Object);

                        services.AddDbContext<TatraDbContext>
                        (options => options.UseInMemoryDatabase("tatraRidgeForAccounts"));
                    });
                });

            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task RgisterUser_ForValidModel_ReturnsOK()
            => await new AccountsRegisterTestsBuilder(_factory, _client).SetNewValidUser()
                                                                        .SetStatusCode(HttpStatusCode.OK)
                                                                        .Build();

        [Fact]
        public async Task RgisterUser_ForInvalidModel_ReturnsBadRequest()
            => await new AccountsRegisterTestsBuilder(_factory, _client).SetExistingEmail()
                                                                .SetStatusCode(HttpStatusCode.BadRequest)
                                                                .Build();

        [Fact]
        public async Task Login_ForRegisteUser_RetursOk()
        {
            //arrange

            _accountServiceMoq.Setup(e => e.GenerateJwt(It.IsAny<LoginDto>()))
                              .Returns("jwt");

            var loginDto = new LoginDto()
            {
                Email = "test@test.com",
                Password = "password123"
            };

            var httpContent = loginDto.ToJsonHttpContent();

            //act

            var response = await _client.PostAsync("/api/account/login", httpContent);

            //assert

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        }
    }
}