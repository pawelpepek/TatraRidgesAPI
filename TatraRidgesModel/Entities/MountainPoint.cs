using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidges.Model.Entities;

[Table("MountainPoints")]
public class MountainPoint
{
    public int Id { get; set; }
    public byte PointTypeId { get; set; }
    public string Name { get; set; }
    public string AlternativeName { get; set; }
    public short? Evaluation { get; set; }
    public bool PrecisedEvaluation { get; set; }
    public decimal WikiLatitude { get; set; }
    public decimal WikiLongitude { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? WikiAddress { get; set; }

    public virtual List<PointsConnection> PointsConnections1 { get; set; }
    public virtual List<PointsConnection> PointsConnections2 { get; set; }

    public virtual PointType PointType { get; set; }
}
