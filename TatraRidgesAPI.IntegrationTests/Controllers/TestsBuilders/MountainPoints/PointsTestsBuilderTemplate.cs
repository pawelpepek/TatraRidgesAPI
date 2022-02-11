using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using TatraRidges.Model.Entities;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.MountainPoints
{
    public abstract class PointsTestsBuilderTemplate:ControllersTestsBuilderTemplate
    {
        protected MountainPoint _point;

        public PointsTestsBuilderTemplate(WebApplicationFactory<Startup> factory, HttpClient client)
            :base(factory,client){}
      

        public PointsTestsBuilderTemplate SetPointInContext(bool existing)
        {
            _point = new MountainPointsTester(_factory).GetMountainPoint(existing);
            return this;
        }
    }
}
