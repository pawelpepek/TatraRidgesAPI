using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TatraRidges.WebScraping.Model.Structures;

namespace TatraRidges.WebScraping.Model.Scrapers
{
    public class PointsManyListsScraper: List<OneCategoryScraper>
    {
        public async Task<List<BasicPointInfo>> GetList()
        {
            var list = new List<BasicPointInfo>();
            foreach (var item in this)
            {
                list.AddRange(await item.GetList());
            }
            return list.ToList();
        }
    }
}
