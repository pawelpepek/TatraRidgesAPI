namespace TatraRidges.Model.Procedures.SearchModel
{
    public interface IConnectionOwner
    {
        PointsConnection Data { get; }
        void Delete();
    }
}