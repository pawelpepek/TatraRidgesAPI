namespace TatraRidges.Model.Entities
{
    public class AdditionalDescription
    {
        public int Id { get; set; }
        public long RouteId { get; set; }
        public string Description { get; set; }
        public bool Warning { get; set; }

        public virtual Route Route { get; set; }
    }
}
