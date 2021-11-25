using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidges.Model.Entities;

[Table("Guides")]
public class Guide
{

    public byte Id { get; set; }
    public string ShortName { get; set; }
    public string Name { get; set; }
    public string Author { get; set; }

    public virtual List<Route> Route { get; set; }
}

