//namespace TatraRidges.Model.Entities.Procedures;

//public class RidgeFinder
//{
//    private IQueryable<PointsConnection> _ridges;

//    private RidgeFinder() { }

//    public static List<PointsConnection>? FindRidge(MountainPoint pointFrom, MountainPoint pointTo)
//        => FindRidge(pointFrom.Id, pointTo.Id);

//    public static List<PointsConnection>? FindRidge(int pointFromId, int pointToId)
//    {
//        using var context = new TatraDBContext();
//        var instance = new RidgeFinder
//        {
//            _ridges = context.PointsConnections.Where(con => con.Ridge)
//        };
//        return instance.FindRidgeForPoints(pointFromId, pointToId);
//    }

//    private List<PointsConnection>? FindRidgeForPoints(int pointFromId, int pointToId)
//    {
//        var ridgesFromStart = AllConnectionsFromPoint(pointFromId);
//        if (ridgesFromStart == null)
//        {
//            return null;
//        }
//        var ridgeToPointTo = ridgesFromStart.FirstOrDefault(r => r.PointId1 == pointToId || r.PointId2 == pointToId);

//        if (ridgeToPointTo != null)
//        {
//            return new List<PointsConnection>() { ridgeToPointTo };
//        }
//        else
//        {
//            foreach (var r in ridgesFromStart)
//            {
//                var nextPointFrom = PointDifferentLike(r, pointFromId);
//                var connectedRidges = FindRidgeForPoints(nextPointFrom, pointToId);
//                if (connectedRidges != null)
//                {
//                    connectedRidges.Insert(0, r);
//                    return connectedRidges;
//                }
//            }
//        }
//        return null;
//    }

//    private IQueryable<PointsConnection>? AllConnectionsFromPoint(int pointFromId)
//    {
//        var ridgesFromStart = _ridges.Where(con => con.PointId1 == pointFromId || con.PointId2 == pointFromId);
//        _ridges = _ridges.Where(r => !ridgesFromStart.Contains(r));
//        return ridgesFromStart;
//    }

//    private static int PointDifferentLike(PointsConnection connection, int notThisPointId)
//        => connection.PointId1 == notThisPointId ? connection.PointId2 : connection.PointId1;
//}


