using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidges.Model.Entities;

[Table("DescriptionAdjectivePairs")]
public class DescriptionAdjectivePair
{
    public long Id { get; set; }
    public long RouteId { get; set; }
    public string AdjectiveId { get; set; }

    public virtual Route Route { get; set; }
    public virtual Adjective Adjective { get; set; }
}

