namespace TatraRidges.Model.Procedures.SearchModel
{
    public class Points : List<Point>
    {
        private readonly List<int> _routeIds = new();
        public Points(List<PointsConnection> connections, int id1, int id2)
        {
            foreach (var con in connections)
            {
                var point1 = GetPoint(con.PointId1);
                var point2 = GetPoint(con.PointId2);

                var connection = new Connection(con);

                connection.Subscribe(point1);
                connection.Subscribe(point2);
            }
            _routeIds.Add(id1);
            _routeIds.Add(id2);
        }

        public void OnlyRidge()
        {
            var count = Count;
            var proccess = true;


            while (proccess)
            {
                RemoveLastLeaf();
                var newCount = Count;
                proccess = newCount != count;
                count = newCount;
            }
        }

        private void RemoveLastLeaf()
        {
            var removed = this.Where(p => p.Connections.Count == 1 && !_routeIds.Contains(p.Id)).ToList();
            for (var i = removed.Count - 1; i >= 0; i--)
            {
                if (removed[i].Connections.Any())
                {
                    removed[i].Connections[0].Delete();
                }
                Remove(removed[i]);
            }

        }

        private Point GetPoint(int id)
        {
            var point = this.FirstOrDefault(p => p.Id == id);
            if (point == null)
            {
                point = new Point(id);
                Add(point);
            }
            return point;
        }
    }
}
