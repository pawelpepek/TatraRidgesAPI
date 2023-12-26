using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Helpers;
using TatraRidges.Model.Interfaces;
using TatraRidges.Model.Procedures.SearchModel;

namespace TatraRidgesAPI.Services
{
    public class RidgeFinder : IRidgeFinder
    {
        private readonly ICashScopeService _cashService;

        public RidgeFinder(ICashScopeService cashService)
        {
            _cashService = cashService;
        }

        public List<PointsConnectionWithDirection> FindRidge(int pointFromId, int pointToId)
        {
            var result = new List<PointsConnectionWithDirection>();

            var points = new Points(_cashService.GetConnections(), pointFromId, pointToId);

            points.OnlyRidge();

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
}
