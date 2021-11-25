using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("Routes")]
public class Route
{
    public long Id { get; set; }
    public long ConnectionId { get; set; }
    public bool ConsistentDirection { get; set; }
    public byte DifficultyId { get; set; }
    public byte DifficultyDetailId { get; set; }
    public bool Rappeling { get; set; }
    public byte RouteTypeId { get; set; }
    public int GuideDescriptionId { get; set; }
    public System.TimeSpan RouteTime { get; set; }

    public virtual PointsConnection PointsConnection { get; set; }
    public virtual Difficulty Difficulty { get; set; }
    public virtual DifficultyDetail DifficultyDetail { get; set; }
    public virtual GuideDescription GuideDescription { get; set; }
    public virtual RouteType RouteType { get; set; }

    public virtual IList<Description> Description { get; set; }
}
