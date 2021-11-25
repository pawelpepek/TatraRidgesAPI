using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("Difficulties")]
public class Difficulty
{
    public byte Id { get; set; }
    public string Text { get; set; }
    public virtual List<Route> Route { get; set; }
}

