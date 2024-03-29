﻿using TatraRidges.Model.Dtos;
using TatraRidges.Model.Interfaces;

namespace TatraRidges.Model.Helpers.RouteSummary
{
    internal class DescriptionCreator
    {
        private readonly List<RouteDto> _routes;
        private readonly ICashScopeService _cash;

        public DescriptionCreator(ICashScopeService cash, List<RouteDto> routes)
        {
            _routes = routes;
            _cash = cash;
        }

        public static string GetDescription(ICashScopeService cash, List<RouteDto> routes)
        {
            return new DescriptionCreator(cash, routes).GetDescription();
        }

        private string GetDescription()
        {
            var groupsIds = _cash.GetAdjectives().Select(a => GetGroup(a)).ToList();

            var groups = groupsIds.GroupBy(i => i)
                                  .Select(g => g.First())
                                  .ToList();

            var allTicks = RouteTimeCounter.TicksCount(_routes);

            var groupsData = groups.Select(g => new AdjectiveGroupData(g, GetCommonAdjectives(g), allTicks))
                                   .ToList();

            foreach (var route in _routes)
            {
                var adjectivesExamples = route.DescriptionAdjective.Select(AdjectiveExample)
                                                                   .ToList();
                foreach (var adjective in adjectivesExamples)
                {
                    var group = groupsData.First(g => g.Id == GetGroup(adjective));
                    group.AddTimeAndRank(route.RouteTime.Ticks, adjective);
                }
            }

            var adjectivesGroups = groupsData.Where(g => !g.IsToLower()).ToList();

            adjectivesGroups.ForEach(g => g.FindClosestAdjective());

            var partsDescriptions = adjectivesGroups
                .Where(g => g.IsPart()).Select(g => g.GetText());
            var mostDescriptions = adjectivesGroups
                .Where(g => !g.IsPart()).Select(g => g.GetText());

            var partsText = partsDescriptions.Any() 
                          ? "częściowo " + ConcatAdjectives(partsDescriptions) : "";
            var andText = mostDescriptions.Any() && partsDescriptions.Any() ? "oraz" : "";
            var mostText = ConcatAdjectives(mostDescriptions);

            var parts = new string[] { "Droga", mostText, andText, partsText }.Where(t => t != "");

            return String.Join(" ", parts);
        }

        private static string ConcatAdjectives(IEnumerable<string> adjectives)
        {
            var lastItem = "";
            var lastText = "";

            if (adjectives.Count() > 1)
            {
                lastItem = adjectives.Last();
                lastText = " i " + lastItem;
            }
            return String.Join(", ", adjectives.Where(a => a != lastItem)) + lastText;
        }


        private Adjective AdjectiveExample(AdjectiveDto a) => _cash.GetAdjectives()
            .First(o => o.Id == a.Id);
        private List<Adjective> GetCommonAdjectives(string group) => _cash.GetAdjectives()
            .ToList().Where(a => GetGroup(a) == group).ToList();
        private static string GetGroup(Adjective adjecvtive) => adjecvtive.Id[1..];
        private static bool IsPartValue(Adjective adjective) => adjective.Id.StartsWith("n");
    }
}
