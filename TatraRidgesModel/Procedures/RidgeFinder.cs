using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Helpers;

namespace TatraRidges.Model.Procedures;

public class RidgeFinder
{
    private readonly TatraDbContext _context;
    private IQueryable<PointsConnection> _ridges;

    public RidgeFinder(TatraDbContext context)
    {
        _context = context;
    }

    public List<PointsConnectionWithDirection> FindRidge(int pointFromId, int pointToId)
    {
        _ridges = _context.PointsConnections.Where(con => con.Ridge)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.RouteType)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.Difficulty)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.DifficultyDetail)
                                            .Include(c => c.Routes)
                                            .ThenInclude(c => c.DescriptionAdjectivePairs)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.DescriptionAdjectivePairs)
                                            .ThenInclude(a => a.Adjective);
        return FindRidgeForPoints(pointFromId, pointToId);
    }

    private List<PointsConnectionWithDirection> FindRidgeForPoints(int pointFromId, int pointToId)
    {
        var ridgesFromStart = AllConnectionsFromPoint(pointFromId);
        if (!ridgesFromStart.Any())
        {
            return new List<PointsConnectionWithDirection>();
        }
        var ridgeToPointTo = ridgesFromStart
                    .FirstOrDefault(r => r.PointId1 == pointToId || r.PointId2 == pointToId);

        if (ridgeToPointTo != null)
        {
            var findedConnection = new PointsConnectionWithDirection()
            {
                PointsConnection = ridgeToPointTo,
                ConsistDirection = ridgeToPointTo.PointId1 == pointFromId
            };
            return new List<PointsConnectionWithDirection>() { findedConnection };
        }
        else
        {
            foreach (var r in ridgesFromStart)
            {
                var nextPointFrom = PointDifferentLike(r, pointFromId);
                var connectedRidges = FindRidgeForPoints(nextPointFrom, pointToId);
                if (connectedRidges.Any())
                {
                    var findedConnection = new PointsConnectionWithDirection()
                    {
                        PointsConnection = r,
                        ConsistDirection = r.PointId1 == pointFromId
                    };
                    connectedRidges.Insert(0, findedConnection);
                    return connectedRidges;
                }
            }
        }
        return new List<PointsConnectionWithDirection>();
    }

    private IList<PointsConnection> AllConnectionsFromPoint(int pointFromId)
    {
        var ridgesFromStart = _ridges.Where(con => con.PointId1 == pointFromId || con.PointId2 == pointFromId)
                                     .ToList();
        _ridges = _ridges.Where(r => !ridgesFromStart.Contains(r));
        return ridgesFromStart;
    }

    private static int PointDifferentLike(PointsConnection connection, int notThisPointId)
        => connection.PointId1 == notThisPointId ? connection.PointId2 : connection.PointId1;
}


