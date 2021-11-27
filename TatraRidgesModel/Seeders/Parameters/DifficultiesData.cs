namespace TatraRidges.Model.Seeders.ParametersData
{
    internal class DifficultiesData : SeederTemplate<Difficulty>
    {
        public DifficultiesData(TatraDbContext context) : base(context) { }

        public override List<Difficulty> GetEntities()
        {
            return new List<Difficulty>()
            {
                new Difficulty(){Id=0, Text="0"},
                new Difficulty(){Id=1, Text="I"},
                new Difficulty(){Id=2, Text="II"},
                new Difficulty(){Id=3, Text="III"},
                new Difficulty(){Id=4, Text="IV"},
                new Difficulty(){Id=5, Text="V"},
                new Difficulty(){Id=6, Text="VI"},
                new Difficulty(){Id=7, Text="VII"}
            };
        }
    }
}
