using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidges.Model.Entities;

[Table("PointsConnections")]
public class PointsConnection
{
    public long Id { get; set; }
    public int PointId1 { get; set; }
    public int PointId2 { get; set; }
    public bool Ridge { get; set; }

    public virtual MountainPoint MountainPoint1 { get; set; }
    public virtual MountainPoint MountainPoint2 { get; set; }

    public virtual List<Route> Routes { get; set; }

    public static PointsConnection Empty()
    {
        return new PointsConnection() { Id = -1 };
    }
    public bool IsEmpty() => Id < 0;
    public bool IsNotEmpty() => Id > 0;
}

