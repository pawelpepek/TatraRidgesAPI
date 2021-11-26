using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Entities.Helpers;

namespace TatraRidges.Model.Entities;
public class TatraDBContext : DbContext
{
    private readonly string _connectionString = "Server=localhost\\SQLEXPRESS;Database=TatraDb;Trusted_Connection=True;";

    public DbSet<Description> Descriptions { get; set; }
    public DbSet<Difficulty> Difficulties { get; set; }
    public DbSet<DifficultyDetail> DifficultyDetails { get; set; }
    public DbSet<Guide> Guides { get; set; }
    public DbSet<GuideDescription> GuideDescriptions { get; set; }
    public DbSet<MountainPoint> MountainPoints { get; set; }
    public DbSet<PointsConnection> PointsConnections { get; set; }
    public DbSet<PointType> PointTypes { get; set; }
    public DbSet<RouteType> RouteTypes { get; set; }
    public DbSet<Route> Routes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        ModelCreatorForTatras.Create(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_connectionString);
        base.OnConfiguring(optionsBuilder);
    }
}

