using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities
{
    [Table("GuideDescriptions")]
    public class GuideDescription
    {
        public byte Id { get; set; }
        public string Number { get; set; }
        public short Page { get; set; }
        public short Volume { get; set; }
        public byte GuideId { get; set; }
        public virtual Guide Guide { get; set; }
    }
}
