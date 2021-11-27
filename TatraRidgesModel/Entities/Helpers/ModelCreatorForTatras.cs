using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TatraRidges.Model.Entities.Helpers;

internal static class ModelCreatorForTatras
{
    internal static void Create(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Adjective>()
            .Property(d => d.Id)
            .SettingsForString(2);
        modelBuilder.Entity<Adjective>()
            .Property(d => d.Text)
            .SettingsForString(50);
        modelBuilder.Entity<Adjective>()
            .Property(d => d.Rank)
            .IsRequired();

        modelBuilder.Entity<Difficulty>()
            .Property(d => d.Text)
            .SettingsForString(5);

        modelBuilder.Entity<DifficultyDetail>()
            .Property(d => d.Sign)
            .SettingsForString(1);

        modelBuilder.Entity<Guide>()
            .Property(g => g.ShortName)
            .SettingsForString(5);
        modelBuilder.Entity<Guide>()
            .Property(g => g.Name)
            .SettingsForString(50);
        modelBuilder.Entity<Guide>()
            .Property(g => g.Author)
            .SettingsForString(50);

        modelBuilder.Entity<GuideDescription>()
            .Property(g => g.Number)
            .SettingsForString(20);
        modelBuilder.Entity<GuideDescription>()
            .Property(g => g.Page)
            .IsRequired();
        modelBuilder.Entity<GuideDescription>()
            .Property(g => g.Volume)
            .IsRequired();
        modelBuilder.Entity<GuideDescription>()
            .Property(g => g.GuideId)
            .IsRequired();

        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.PointTypeId)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.Name)
            .SettingsForString(50);
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.AlternativeName)
            .SettingsForString(50);
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.PrecisedEvaluation)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.WikiLatitude)
            .SettingsForDecimal();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.WikiLongitude)
            .SettingsForDecimal();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.Latitude)
            .SettingsForDecimal();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.Longitude)
            .SettingsForDecimal();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.WikiAddress)
            .IsRequired();

        modelBuilder.Entity<PointsConnection>()
            .Property(c => c.PointId1)
            .IsRequired();
        modelBuilder.Entity<PointsConnection>()
            .Property(c => c.PointId2)
            .IsRequired();
        modelBuilder.Entity<PointsConnection>()
            .Property(c => c.Ridge)
            .IsRequired();
        modelBuilder.Entity<PointsConnection>()
            .HasOne(c => c.MountainPoint1)
            .WithMany(p => p.PointsConnections1)
            .OnDelete(DeleteBehavior.Restrict)
            .HasForeignKey(c => c.PointId1);
        modelBuilder.Entity<PointsConnection>()
            .HasOne(c => c.MountainPoint2)
            .WithMany(p => p.PointsConnections2)
            .OnDelete(DeleteBehavior.Restrict)
            .HasForeignKey(c => c.PointId2);    

        modelBuilder.Entity<PointType>()
            .Property(t => t.Name)
            .HasMaxLength(10)
            .IsRequired();

        modelBuilder.Entity<RouteType>()
            .Property(t => t.Name)
            .SettingsForString(20);
        modelBuilder.Entity<RouteType>()
            .Property(t => t.Rank)
            .IsRequired();

        modelBuilder.Entity<Route>()
            .Property(r => r.PointsConnectionId)
            .IsRequired();
        modelBuilder.Entity<Route>()
            .Property(r => r.ConsistentDirection)
            .IsRequired();
        modelBuilder.Entity<Route>()
            .Property(r => r.DifficultyId)
            .IsRequired();
        modelBuilder.Entity<Route>()
            .Property(r => r.DifficultyDetailId)
            .IsRequired();
        modelBuilder.Entity<Route>()
            .Property(r => r.Rappeling)
            .IsRequired();
        modelBuilder.Entity<Route>()
            .Property(r => r.RouteTypeId)
            .IsRequired();
        modelBuilder.Entity<Route>()
            .Property(r => r.RouteTime)
            .IsRequired();

        modelBuilder.Entity<DescriptionAdjectivePair>()
            .Property(rd => rd.AdjectiveId)
            .IsRequired();
        modelBuilder.Entity<DescriptionAdjectivePair>()
            .Property(rd => rd.RouteId)
            .IsRequired();
    }
    private static void SettingsForDecimal(this PropertyBuilder<decimal> property)
    {
        property.HasColumnType("decimal(8,6)").IsRequired();
    }
    private static void SettingsForString(this PropertyBuilder<string> property, int maxSigns)
    {
        property.HasMaxLength(maxSigns).IsRequired();
    }
}

