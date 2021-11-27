namespace TatraRidges.Model.Seeders.ExampleData
{
    internal static class GuideDescriptionsData
    {
        public static List<GuideDescription> GetEntities()
        {
            return new List<GuideDescription>()
            {
                new GuideDescription()
                {
                    GuideId=1,
                    Number="31 C,E",
                    Page=57,
                    Volume = 1
                },
                new GuideDescription()
                {
                    GuideId=1,
                    Number="41 R",
                    Page=73,
                    Volume = 1
                },
                new GuideDescription()
                {
                    GuideId=1,
                    Number="44 B-E",
                    Page=77,
                    Volume = 1
                },
                new GuideDescription()
                {
                    GuideId=1,
                    Number="44 A",
                    Page=77,
                    Volume = 1
                },
                new GuideDescription()
                {
                    GuideId=1,
                    Number="41 O,P",
                    Page=73,
                    Volume = 1
                }
            };
        }
    }
}
