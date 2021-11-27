namespace TatraRidges.Model.Seeders.ExampleData
{
    internal static class MountainPointsData
    {
        public static List<MountainPoint> GetEntities()
        {
            return new List<MountainPoint>()
            {
                new MountainPoint()
                {
                    PointTypeId=1,
                    Name="Świnica",
                    AlternativeName="Svinica",
                    WikiAddress="Świnica",
                    Evaluation=2301,
                    PrecisedEvaluation=true,
                    WikiLatitude=49.219417m,
                    WikiLongitude=20.009306m,
                    Latitude=49.219417m,
                    Longitude=20.009306m
                },
                new MountainPoint()
                {
                    PointTypeId=1,
                    Name="Świnica Taternicka",
                    AlternativeName="Svinica Severozápadna",
                    WikiAddress="Świnica",
                    Evaluation=2991,
                    PrecisedEvaluation=true,
                    WikiLatitude=49.220080m,
                    WikiLongitude=20.008627m,
                    Latitude=49.220080m,
                    Longitude=20.008627m
                },
                new MountainPoint()
                {
                    PointTypeId=2,
                    Name="Gąsienicowa Przełączka",
                    AlternativeName="Gąsienicova štrbina",
                    WikiAddress="Gąsienicowa_Przełączka",
                    Evaluation=2265,
                    PrecisedEvaluation=false,
                    WikiLatitude=49.219333m,
                    Latitude=49.219333m,
                    WikiLongitude=20.010694m,
                    Longitude=20.010694m
                },
                new MountainPoint()
                {
                    PointTypeId=2,
                    Name="Walentkowa Przełęcz",
                    AlternativeName="Valentkovo sedlo",
                    WikiAddress="Walentkowa_Przełęcz",
                    Evaluation=2100,
                    PrecisedEvaluation=true,
                    WikiLatitude=49.216361m,
                    Latitude=49.216361m,
                    WikiLongitude=20.009139m,
                    Longitude=20.009139m
                },
                new MountainPoint()
                {
                    PointTypeId=1,
                    Name="Walentkowy Wierch",
                    AlternativeName="Valentkova",
                    WikiAddress="Walentkowy_Wierch",
                    Evaluation=2156,
                    PrecisedEvaluation=true,
                    WikiLatitude=49.213889m,
                    Latitude=49.213889m,
                    WikiLongitude=20.006944m,
                    Longitude=20.006944m
                },
                new MountainPoint()
                {
                    PointTypeId=1,
                    Name="Gąsienicowa Turnia",
                    AlternativeName="Gąsienicova turnia",
                    WikiAddress="Gąsienicowa_Turnia",
                    Evaluation=2280,
                    PrecisedEvaluation=true,
                    WikiLatitude=49.219444m,
                    Latitude=49.219444m,
                    WikiLongitude=20.011944m,
                    Longitude=20.011944m
                }
            };
        }
    }
}
