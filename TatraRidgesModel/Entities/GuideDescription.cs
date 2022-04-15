using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidges.Model.Entities
{
    [Table("GuideDescriptions")]
    public class GuideDescription
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public short Page { get; set; }
        public short Volume { get; set; }
        public byte GuideId { get; set; }
        public virtual Guide Guide { get; set; }
    }
}