﻿using System.ComponentModel.DataAnnotations.Schema;
using TatraRidges.Model.Helpers;

namespace TatraRidges.Model.Entities;

[Table("Routes")]
public class Route
{
    public long Id { get; set; }
    public long PointsConnectionId { get; set; }
    public bool ConsistentDirection { get; set; }
    public byte DifficultyId { get; set; }
    public byte DifficultyDetailId { get; set; }
    public bool Rappeling { get; set; }
    public byte RouteTypeId { get; set; }
    public int GuideDescriptionId { get; set; }
    public System.TimeSpan RouteTime { get; set; }

    [NotMapped]
    public int Rank => DescriptionAdjectivePairs.Select(p => p.Adjective).Sum(a => a.Rank);

    [NotMapped]
    public decimal DifficultyValue => DifficultyConverter.GetValueForDifficulty(Difficulty, DifficultyDetail);

    public virtual PointsConnection PointsConnection { get; set; }
    public virtual Difficulty Difficulty { get; set; }
    public virtual DifficultyDetail DifficultyDetail { get; set; }
    public virtual GuideDescription GuideDescription { get; set; }
    public virtual RouteType RouteType { get; set; }

    public virtual List<DescriptionAdjectivePair> DescriptionAdjectivePairs { get; set; }
    public virtual List<AdditionalDescription> AdditionalDescriptions{ get; set; }
}
