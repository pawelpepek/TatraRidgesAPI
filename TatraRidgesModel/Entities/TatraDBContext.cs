using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Entities.Helpers;

namespace TatraRidges.Model.Entities;
public class TatraDbContext : DbContext
{
    public DbSet<Adjective> Adjectives { get; set; }
    public DbSet<Difficulty> Difficulties { get; set; }
    public DbSet<DifficultyDetail> DifficultyDetails { get; set; }
    public DbSet<Guide> Guides { get; set; }
    public DbSet<GuideDescription> GuideDescriptions { get; set; }
    public DbSet<MountainPoint> MountainPoints { get; set; }
    public DbSet<PointsConnection> PointsConnections { get; set; }
    public DbSet<PointType> PointTypes { get; set; }
    public DbSet<RouteType> RouteTypes { get; set; }
    public DbSet<Route> Routes { get; set; }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }

    public TatraDbContext(DbContextOptions<TatraDbContext> options) : base(options) { }

    public DbSet<DescriptionAdjectivePair> DescriptionAdjectivePairs { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        ModelCreatorForTatras.Create(modelBuilder);
    }
}

