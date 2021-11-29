using Microsoft.EntityFrameworkCore;

namespace TatraRidges.Model.Entities.Procedures;

public class RidgeFinder
{
    private readonly TatraDbContext _context;
    private IQueryable<PointsConnection> _ridges;

    public RidgeFinder(TatraDbContext context)
    {
        _context = context;
    }

    public List<PointsConnection> FindRidge(int pointFromId, int pointToId)
    {
        _ridges = _context.PointsConnections.Where(con => con.Ridge);
        return FindRidgeForPoints(pointFromId, pointToId);
    }

    private List<PointsConnection> FindRidgeForPoints(int pointFromId, int pointToId)
    {
        var ridgesFromStart = AllConnectionsFromPoint(pointFromId);
        if (!ridgesFromStart.Any())
        {
            return new List<PointsConnection>();
        }
        var ridgeToPointTo = ridgesFromStart.FirstOrDefault(r => r.PointId1 == pointToId || r.PointId2 == pointToId);

        if (ridgeToPointTo != null)
        {
            return new List<PointsConnection>() { ridgeToPointTo };
        }
        else
        {
            foreach (var r in ridgesFromStart)
            {
                var nextPointFrom = PointDifferentLike(r, pointFromId);
                var connectedRidges = FindRidgeForPoints(nextPointFrom, pointToId);
                if (connectedRidges.Any())
                {
                    connectedRidges.Insert(0, r);
                    return connectedRidges;
                }
            }
        }
        return new List<PointsConnection>();
    }

    private IQueryable<PointsConnection> AllConnectionsFromPoint(int pointFromId)
    {
        var ridgesFromStart = _ridges.Where(con => con.PointId1 == pointFromId || con.PointId2 == pointFromId);
        _ridges = _ridges.Where(r => !ridgesFromStart.Contains(r));
        return ridgesFromStart;
    }

    private static int PointDifferentLike(PointsConnection connection, int notThisPointId)
        => connection.PointId1 == notThisPointId ? connection.PointId2 : connection.PointId1;
}


