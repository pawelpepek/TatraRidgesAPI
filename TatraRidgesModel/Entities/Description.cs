using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("descriptions")]
public class Description
{
    public string Id { get; set; }
    public string Text { get; set; }
    public short Rank { get; set; }

    public virtual List<Route> Route { get; set; }
}


