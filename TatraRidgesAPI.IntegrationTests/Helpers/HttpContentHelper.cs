using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace TatraRidgesAPI.IntegrationTests.Helpers
{
    public static class HttpContentHelper
    {
        public static HttpContent ToJsonHttpContent(this object obj)
        {
            var json = JsonConvert.SerializeObject(obj);

            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            return httpContent;
        }
    }
}
