using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidgesModel.Entities;

[Table("DifficultyDetails")]
public class DifficultyDetail
{
    public byte Id { get; set; }
    public string Sign { get; set; }

    public virtual List<Route> Route { get; set; }
}

