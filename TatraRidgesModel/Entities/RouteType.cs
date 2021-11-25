using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("RouteTypes")]
public class RouteType
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public byte Rank { get; set; }

    public virtual List<Route> Route { get; set; }
}

