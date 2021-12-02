namespace TatraRidges.Model.Seeders.ParametersData
{
    internal class RolesData : SeederTemplate<Role>
    {
        public RolesData(TatraDbContext context) : base(context) { }
        public override List<Role> GetEntities()
        {
            return new List<Role>()
            {
                new Role(){Name="User"},
                new Role(){Name="Admin"}
            };
        }
    }
}
