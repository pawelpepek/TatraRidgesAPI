using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidges.Model.Entities;

[Table("RouteTypes")]
public class RouteType
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public byte Rank { get; set; }

    public virtual List<Route> Routes { get; set; }
}

