namespace TatraRidges.Model.Procedures.SearchModel
{

    public class Point : ISubscriber
    {
        public int Id { get; }

        public List<IConnectionOwner> Connections { get; } = new List<IConnectionOwner>();

        public Point(int id) => Id = id;

        public void Notify(IConnectionOwner connection, string version)
        {
            if (version == "remove")
            {
                Connections.Remove(connection);
            }
            if (version == "add")
            {
                Connections.Add(connection);
            }
        }

    }
}
