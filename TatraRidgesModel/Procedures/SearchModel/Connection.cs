namespace TatraRidges.Model.Procedures.SearchModel
{
    public class Connection : IConnectionOwner
    {
        private readonly List<ISubscriber> _subscribers = new();
        public PointsConnection Data { get; }

        public Connection(PointsConnection data)
        {
            Data = data;
        }

        public void Subscribe(ISubscriber subscriber)
        {
            if (!_subscribers.Contains(subscriber))
            {
                _subscribers.Add(subscriber);
                subscriber.Notify(this, "add");
            }
        }

        public void Delete()
        {
            foreach (var subscriber in _subscribers)
            {
                subscriber.Notify(this, "remove");
            }
        }
    }
}
