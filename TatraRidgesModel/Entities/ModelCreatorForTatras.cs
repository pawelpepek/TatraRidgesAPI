using Microsoft.EntityFrameworkCore;

namespace TatraRidgesModel.Entities;

internal static class ModelCreatorForTatras
{
    internal static void Create(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Description>()
            .Property(d => d.Text)
            .IsRequired()
            .HasMaxLength(50);
        modelBuilder.Entity<Description>()
            .Property(d => d.Rank)
            .IsRequired();

        modelBuilder.Entity<Difficulty>()
            .Property(d => d.Text)
            .HasMaxLength(5)
            .IsRequired();

        modelBuilder.Entity<DifficultyDetail>()
            .Property(d => d.Sign)
            .HasMaxLength(1)
            .IsRequired();

        modelBuilder.Entity<Guide>()
            .Property(g => g.ShortName)
            .HasMaxLength(5)
            .IsRequired();
        modelBuilder.Entity<Guide>()
            .Property(g => g.Name)
            .HasMaxLength(50)
            .IsRequired();
        modelBuilder.Entity<Guide>()
            .Property(g => g.Author)
            .HasMaxLength(50)
            .IsRequired();

        modelBuilder.Entity<GuideDescription>()
            .Property(g => g.Number)
            .HasMaxLength(20)
            .IsRequired();
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
            .HasMaxLength(50)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.AlternativeName)
            .HasMaxLength(50)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.PrecisedEvaluation)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.WikiLatitude)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.WikiLongitude)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.Latitude)
            .IsRequired();
        modelBuilder.Entity<MountainPoint>()
            .Property(p => p.Longitude)
            .IsRequired();
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

        modelBuilder.Entity<PointType>()
            .Property(t => t.Name)
            .HasMaxLength(10)
            .IsRequired();

        modelBuilder.Entity<RouteType>()
            .Property(t => t.Name)
            .HasMaxLength(20)
            .IsRequired();
        modelBuilder.Entity<RouteType>()
            .Property(t => t.Rank)
            .IsRequired();

        modelBuilder.Entity<Route>()
            .Property(r => r.ConnectionId)
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
    }
}

