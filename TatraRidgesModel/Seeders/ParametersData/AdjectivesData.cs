namespace TatraRidges.Model.Seeders.ParametersData;

internal class AdjectivesData : SeederTemplate<Adjective>
{
    public AdjectivesData(TatraDbContext context) : base(context) { }
    public override List<Adjective> GetEntities()
    {
        return new List<Adjective>()
        {
            new Adjective()
            {
                Id = "_c",
                Text = "Ciekawa",
                Rank = 3
            },
            new Adjective()
            {
                Id = "_e",
                Text = "Eksponowana",
                Rank = 5
            },
            new Adjective()
            {
                Id = "_k",
                Text = "Krucha",
                Rank = -5
            },
            new Adjective()
            {
                Id = "_p",
                Text = "Piękna",
                Rank = 5
            },
            new Adjective()
            {
                Id = "_w",
                Text = "Widokowo piękna",
                Rank = 5
            },
            new Adjective()
            {
                Id = "bk",
                Text = "Bardzo krucha",
                Rank = -7
            },
            new Adjective()
            {
                Id = "bp",
                Text = "Bardzo piękna",
                Rank = 7
            },
            new Adjective()
            {
                Id = "bw",
                Text = "Widokowo bardzo piękna",
                Rank = 7
            },
            new Adjective()
            {
                Id = "be",
                Text = "Bardzo eksponowana",
                Rank = 7
            },
            new Adjective()
            {
                Id = "ce",
                Text = "Cześciowo eksponowana",
                Rank = 3},
            new Adjective()
            {
                Id = "ck",
                Text = "Częściowo krucha",
                Rank = -3
            },
            new Adjective()
            {
                Id = "me",
                Text = "Nieco eksponowana",
                Rank = 3
            },
            new Adjective()
            {
                Id = "nc",
                Text = "Nieciekawa",
                Rank = -7
            },
            new Adjective()
            {
                Id = "wk",
                Text = "Niezwykle krucha",
                Rank = -10
            },
            new Adjective()
            {
                Id = "wp",
                Text = "Wspaniała",
                Rank = 10
            },
            new Adjective()
            {
                Id = "ww",
                Text = "Widokowo wspaniała",
                Rank = 10
            },
            new Adjective()
            {
                Id = "_z",
                Text = "Zajmująca",
                Rank = 2
            },
            new Adjective()
            {
                Id = "dz",
                Text = "Dość zajmująca",
                Rank = 1
            },
            new Adjective()
            {
                Id = "dc",
                Text = "Dość ciekawa",
                Rank = 1
            }
        };
    }
}

