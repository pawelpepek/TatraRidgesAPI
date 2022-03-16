namespace TatraRidges.Model.Procedures.SearchModel
{
    public interface ISubscriber
    {
        void Notify(IConnectionOwner connection, string version);
    }
}