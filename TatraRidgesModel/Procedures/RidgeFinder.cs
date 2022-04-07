using Microsoft.EntityFrameworkCore;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Procedures.SearchModel;

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
                                            .ThenInclude(r => r.AdditionalDescriptions)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.Difficulty)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.DifficultyDetail)
                                            .Include(c => c.Routes)
                                            .ThenInclude(c => c.DescriptionAdjectivePairs)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.DescriptionAdjectivePairs)
                                            .ThenInclude(a => a.Adjective)
                                            .Include(c => c.Routes)
                                            .ThenInclude(r => r.GuideDescription)
                                            .ThenInclude(d => d.Guide);
        return FindRidgeForPoints(pointFromId, pointToId);
    }

    private List<PointsConnectionWithDirection> FindRidgeForPoints(int pointFromId, int pointToId)
    {
        var result = new List<PointsConnectionWithDirection>();

        var points = new Points(_ridges.ToList(), pointFromId, pointToId);

        try
        {
            points.OnlyRidge();
        }
        catch (Exception ex)
        {

        }

        var connections = points.SelectMany(p => p.Connections)
                                .Select(c => c.Data)
                                .GroupBy(c => c.Id)
                                .Select(g => g.First())
                                .ToList();

        var count = connections.Count;

        var fromId = pointFromId;

        for (var i = 0; i < count; i++)
        {
            var connection = connections.First(c => c.PointId1 == fromId || c.PointId2 == fromId);

            var findedConnection = new PointsConnectionWithDirection()
            {
                PointsConnection = connection,
                ConsistDirection = connection.PointId1 == fromId
            };

            fromId = findedConnection.ConsistDirection
                   ? connection.PointId2
                   : connection.PointId1;

            connections.Remove(connection);

            result.Add(findedConnection);
        }

        return result;
    }
}