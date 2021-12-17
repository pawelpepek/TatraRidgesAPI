using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class PointsConnectionModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
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
        }
    }
}
