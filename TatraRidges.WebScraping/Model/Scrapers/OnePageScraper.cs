using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TatraRidges.WebScraping.Model.Structures;

namespace TatraRidges.WebScraping.Model.Scrapers
{
    public class OnePageScraper
    {
        private readonly string _url;
        public string NextPageUrl { get; private set; } = String.Empty;

        public OnePageScraper(string url)
        {
            _url = url;
        }

        internal async Task<List<BasicPointInfo>> GetList()
        {
            var web = new HtmlWeb();
            var doc = await web.LoadFromWebAsync(_url);

            var nextPageItem = doc.QuerySelectorAll("#mw-pages a")
                                  .FirstOrDefault(item => item.InnerText == "następna strona");

            if (nextPageItem != null)
            {
                NextPageUrl = "https://pl.wikipedia.org"
                            + Regex.Unescape(nextPageItem.Attributes["href"].Value)
                                   .Replace("&amp;", "&");
            }

            var items = doc.QuerySelectorAll(".mw-category-group li a");

            return items.Select(GetBasicPointInfo).ToList();
        }
        private BasicPointInfo GetBasicPointInfo(HtmlNode item)
        {
            var name = item.InnerText;
            var url = item.Attributes["href"].Value;
            if (name.Contains('('))
            {
                name = name[..(name.IndexOf("(") - 1)].Trim();
            }
            return new BasicPointInfo(url, name);
        }
    }
}
