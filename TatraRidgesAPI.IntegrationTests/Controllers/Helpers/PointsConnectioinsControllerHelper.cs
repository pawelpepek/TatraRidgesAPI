using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Helpers
{
    public class PointsConnectioinsControllerHelper : ControllerHelperTemplate
    {
        public PointsConnectioinsControllerHelper(HttpClient client, WebApplicationFactory<Startup> factory)
            : base(client, factory) { }
        //public async Task Move_WithModel_ReturnsCode(PointsConnectionCreateDto model, bool authorized)
        //{
        //    //arrange

        //    var scopeFactory = Factory.Services.GetService<IServiceScopeFactory>();
        //    using var scope = scopeFactory.CreateScope();
        //    var dbContext = scope.ServiceProvider.GetService<TatraDbContext>();

        //    var point1 = new MountainPoint()
        //    {
        //        Name = "Tetsowy1",
        //        AlternativeName = "Testowy1",
        //        Evaluation = 2000,
        //        Latitude = 49.12m,
        //        Longitude = 19.91m,
        //        PointTypeId = 1,
        //        PrecisedEvaluation = true,
        //        WikiAddress = "tt",
        //        WikiLatitude = 49.12m,
        //        WikiLongitude = 19.91m
        //    };

        //    dbContext.MountainPoints.Add(point1);

        //    dbContext.SaveChanges();

        //    var model = new PointGPSDto() { Latitude = 49.15m, Longitude = 19.92m };

        //    var json = JsonConvert.SerializeObject(model);

        //    var httpContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");

        //    //act
        //    var response = await Client.PutAsync("/api/point/" + point1.Id, httpContent);

        //    //assert
        //    response.StatusCode.Should().Be(authorized ? HttpStatusCode.OK : HttpStatusCode.Unauthorized);
        //}
    }
}
