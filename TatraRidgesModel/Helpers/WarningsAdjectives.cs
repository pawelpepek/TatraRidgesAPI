namespace TatraRidges.Model.Helpers
{
    public static class WarningsAdjectives
    {
        public static List<string> GetText(List<Route> routes)
        {
            var adjectivesWarnings = routes.SelectMany(r => r.DescriptionAdjectivePairs)
                                           .Select(p => p.Adjective)
                                           .Where(a => a.Id.Substring(1) == "k" && a.Rank < -5)
                                           .OrderBy(a => a.Rank);



            if (adjectivesWarnings.Any())
            {
                return adjectivesWarnings.Take(1)
                                         .Select(a => a.Text)
                                         .ToList();
            }
            else
            {
                return new List<string>();
            }
        }
    }
}
