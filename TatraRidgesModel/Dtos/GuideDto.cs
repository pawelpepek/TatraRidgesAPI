using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TatraRidges.Model.Dtos
{
    public class GuideDto
    {
        public byte Id { get; set; }
        public string ShortName { get; set; }
        public string Name { get; set; }
        public string Author { get; set; }
    }
}
