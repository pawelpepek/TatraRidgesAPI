
using TatraRidges.Model.Entities;

namespace TatraRidges.WebScraping.Model.Structures
{
    public class BasicPointInfo
    {
        public string Url{get;}
        public string Name{get;}

        public PointType Type { get; set; }

        public BasicPointInfo(string url,string name)
        {
            Url = url;
            Name = name;
        }
    }
}
