using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("PointsConnections")]
public class PointsConnection
{
    public long Id { get; set; }
    public int PointId1 { get; set; }
    public int PointId2 { get; set; }
    public bool Ridge { get; set; }

    public virtual MountainPoint MountainPoint1 { get; set; }
    public virtual MountainPoint MountainPoint2 { get; set; }
    public virtual PointType PointType { get; set; }
}

