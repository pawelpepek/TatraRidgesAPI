namespace TatraRidges.Model.Seeders.ParametersData
{
    internal class PointTypesData : SeederTemplate<PointType>
    {
        public PointTypesData(TatraDbContext context) : base(context) { }
        public override List<PointType> GetEntities()
        {
            return new List<PointType>()
            {
                new PointType(){ Id=1, Name="Szczyt" },
                new PointType(){ Id=2, Name="Przełęcz" },
                new PointType(){ Id=3, Name="Start" },
            };
        }
    }
}
