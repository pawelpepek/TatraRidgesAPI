using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TatraRidges.WebScraping.Model.Scrapers;
using TatraRidges.WebScraping.Model.Structures;
using TatraRidges.WebScraping.ViewModels;

namespace TTatraRidges.WebScraping.ViewModels.Helpers
{
    public class PointsManyScraperFactory
    {
        public PointsManyListsScraper Scraper{get;}
        public PointsManyScraperFactory()
        {
            using var context = DbContextFactory.GetContext();
            var pointTop = context.PointTypes.First(p => p.Name == "Szczyt");
            var pointPass = context.PointTypes.First(p => p.Name == "Przełęcz");


            Scraper = new PointsManyListsScraper()
                {
                    new OneCategoryScraper(
                    "https://pl.wikipedia.org/wiki/Kategoria:Szczyty_Tatr_Wysokich",
                    pointTop),
                    new OneCategoryScraper(
                        "https://pl.wikipedia.org/wiki/Kategoria:Prze%C5%82%C4%99cze_Tatr_Wysokich",
                        pointPass),

                    };
        }
        public async Task<List<BasicPointInfoViewModel>> GetCheckedList()
        {
            var downloadedPoints = await Scraper.GetList();
            var sortedPoints= downloadedPoints.OrderBy(p=>p.Type.Id)  
                                              .ThenBy(p=> p.Name);

            using var context = DbContextFactory.GetContext();

            var checkedList=downloadedPoints.Select(point
                => new BasicPointInfoViewModel(
                    context.MountainPoints.Any(p => p.Name == point.Name),
                    point)).ToList();

            return checkedList;
        }

    }
}
