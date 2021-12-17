using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class RouteModelCreator
    {
        internal static void Create(ModelBuilder modelBuilder)
        {
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
        }
    }
}
