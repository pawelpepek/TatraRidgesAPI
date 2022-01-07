using System.Collections.Generic;
using System.Threading.Tasks;
using TatraRidges.Model.Entities;
using TatraRidges.WebScraping.Model.Structures;

namespace TatraRidges.WebScraping.Model.Scrapers
{
    public class OneCategoryScraper
    {
        private readonly string _url;
        private readonly PointType _pointType;

        public OneCategoryScraper(string url, PointType pointType)
        {
            _url = url;
            _pointType = pointType;
        }
        internal async Task<List<BasicPointInfo>> GetList()
        {
            var nextPageUrl = _url;
            var result = new List<BasicPointInfo>();

            while (nextPageUrl != null)
            {
                var page = new OnePageScraper(nextPageUrl);
                result.AddRange(await page.GetList());
                nextPageUrl = page.NextPageUrl;
            }

            result.ForEach(p=>p.Type= _pointType);

            return result;
        }
    }
}
