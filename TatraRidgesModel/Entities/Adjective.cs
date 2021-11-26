using System.ComponentModel.DataAnnotations.Schema;

namespace TatraRidges.Model.Entities;

[Table("Adjectives")]
public class Adjective
{
    public string Id { get; set; }
    public string Text { get; set; }
    public short Rank { get; set; }

    public virtual List<DescriptionAdjectivePair> DescriptionAdjectivePairs { get; set; }

}


