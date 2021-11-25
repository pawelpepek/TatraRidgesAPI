using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("MountainPoints")]
public class MountainPoint
{
    public int Id { get; set; }
    public byte PointTypeId { get; set; }
    public string Name { get; set; }
    public string AlternativeName { get; set; }
    public Nullable<short> Evaluation { get; set; }
    public bool PrecisedEvaluation { get; set; }
    public decimal WikiLatitude { get; set; }
    public decimal WikiLongitude { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? WikiAddress { get; set; }
}
