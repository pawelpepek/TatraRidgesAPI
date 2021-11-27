namespace TatraRidges.Model.Seeders.ParametersData
{
    internal class GuidesData : SeederTemplate<Guide>
    {
        public GuidesData(TatraDbContext context) : base(context) { }
        public override List<Guide> GetEntities()
        {
            return new List<Guide>()
            {
                new Guide()
                {
                    Id = 1,
                    ShortName="WHP",
                    Name="Tatry Wysokie Przewodnik Taternicki",
                    Author="Witold Henryk Paryski"
                },
                new Guide()
                {
                    Id=2,
                    ShortName="WC", 
                    Name="Tatry Przewodnik Szczegółowy",
                    Author="Władysław Cywiński"
                }
            };
        }
    }
}
