using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TatraRidges.Model.Entities;
using TatraRidges.WebScraping.Model.Structures;

namespace TatraRidges.WebScraping.Model.Scrapers
{
    public static class PointDetailScraper
    {
        public static async Task<MountainPoint> Scrape(BasicPointInfo info)
        {
            var point = new MountainPoint()
            {
                Name = info.Name,
                WikiAddress = info.Url,
                PointTypeId = info.Type.Id
            };

            var web = new HtmlWeb();
            var doc = await web.LoadFromWebAsync("https://pl.wikipedia.org" + info.Url);

            point.Latitude = GetCoordinate(doc, "latitude");
            point.Longitude = GetCoordinate(doc, "longitude");

            point.WikiLatitude = point.Latitude;
            point.WikiLongitude = point.Longitude;

            var (evaluation, precised) = GetEvaluation(doc);

            if (evaluation != 0)
            {
                point.Evaluation = evaluation;
            }
            point.PrecisedEvaluation = precised;

            point.AlternativeName = GetSlovakName(doc);

            return point;
        }

        private static decimal GetCoordinate(HtmlDocument document, string name)
        {
            var coordinate = document.QuerySelectorAll(".geo-nondefault ." + name).FirstOrDefault();
            return coordinate == null ? 0 : Convert.ToDecimal(coordinate.InnerText);
        }

        private static (short evaluation, bool precised) GetEvaluation(HtmlDocument document)
        {

            var th = document.QuerySelectorAll(".infobox th").FirstOrDefault(th => th.InnerText.StartsWith("Wysokość"));
            if (th != null)
            {
                var evaluationText = th.ParentNode.QuerySelector("td").InnerText;
                var precised = !evaluationText.Contains("ok.");
                var value = Regex.Match(evaluationText, @"(?=ok\.\s)*\d{4}(?=\sm\sn\.p\.m\.\s*)");
                return (short.Parse(value.ToString()), precised);
            }
            return (0, false);
        }
        private static string GetSlovakName(HtmlDocument document)
        {
            var previousElement = document.QuerySelectorAll("a").FirstOrDefault(a => a.InnerText == "słow.");

            if (previousElement != null)
            {
                var nodes = previousElement.ParentNode.ChildNodes;
                var index = nodes.GetNodeIndex(previousElement);
                var sk = nodes[index + 1];
                if (sk.Name == "#text")
                {
                    sk = nodes[index + 2];
                }
                return sk == null ? "" : Regex.Match(sk.InnerText, "[^,]*").Value;
            }
            return "";
        }
    }
}
