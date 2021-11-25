using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("PointTypes")]
public class PointType
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public virtual List<MountainPoint> MountainPoint { get; set; }
}

