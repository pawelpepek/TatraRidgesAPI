namespace TatraRidges.Model.Seeders.ParametersData
{
    internal class DifficultyDetailsData : SeederTemplate<DifficultyDetail>
    {
        public DifficultyDetailsData(TatraDbContext context) : base(context) { }
        public override List<DifficultyDetail> GetEntities()
        {
            return new List<DifficultyDetail>()
            {
                new DifficultyDetail(){Id=0, Sign=""},
                new DifficultyDetail(){Id=1, Sign="+"},
                new DifficultyDetail(){Id=2, Sign="-"}
            };
        }
    }
}
