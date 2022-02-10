using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Helpers;
using Xunit;

namespace TatraRidges.Model.UnitTests.Helpers
{
    public class AdjectiveGroupDataTests
    {
        private static readonly List<Adjective> _commonAdjectives = new()
        {
            new Adjective(){Id="ce", Rank=5, Text="Częściowo eksponowana"},
            new Adjective(){Id="de", Rank=4, Text="Dość eksponowana"},
            new Adjective(){Id="_e", Rank=7, Text="Eksponowana"},
            new Adjective(){Id="be", Rank=9, Text="Bardzo eksponowana"},
        };

        public struct AdjectiveAndTicks
        {
            public Adjective? Adjective;
            public long Ticks;
            public AdjectiveAndTicks(string adjectiveId, TimeSpan time)
            {
                Adjective = GetAdjective(adjectiveId);
                Ticks = time.Ticks;
            }
        }

        private static IEnumerable<object[]> GetTestData()
        {
            var list = new List<(List<AdjectiveAndTicks> Data, long AllTicks, string Text)>()
            {
                (new List<AdjectiveAndTicks>()
                {
                    new AdjectiveAndTicks("ce",new TimeSpan(1,0,0)),
                    new AdjectiveAndTicks("de",new TimeSpan(1,0,0))
                },
                new TimeSpan(5,0,0).Ticks,
                "Częściowo eksponowana"),

                (new List<AdjectiveAndTicks>()
                {
                    new AdjectiveAndTicks("be",new TimeSpan(0,1,0)),
                    new AdjectiveAndTicks("de",new TimeSpan(1,0,0))
                },
                new TimeSpan(1,10,0).Ticks,
                "Dość eksponowana"),

                (new List<AdjectiveAndTicks>()
                {
                    new AdjectiveAndTicks("be",new TimeSpan(0,1,0)),
                    new AdjectiveAndTicks("de",new TimeSpan(1,0,0))
                },
                new TimeSpan(10,10,0).Ticks,
                ""),

                (new List<AdjectiveAndTicks>()
                {
                    new AdjectiveAndTicks("_e",new TimeSpan(1,0,0)),
                },
                new TimeSpan(2,0,0).Ticks,
                "Częściowo eksponowana"),
            };
            return list.Select(q => new object[] { q });
        }


        [Theory]
        [MemberData(nameof(GetTestData))]
        public void GetText_ForAdjectivesAndTicksExamples_ReturnsValue((List<AdjectiveAndTicks> Data, long AllTicks, string Text) example)
        {
            //arrange
            var adjectiveGroupData = new AdjectiveGroupData("e", _commonAdjectives, example.AllTicks);

            foreach(var adjectiveTicks in example.Data)
            {
                adjectiveGroupData.AddTimeAndRank(adjectiveTicks.Ticks, adjectiveTicks.Adjective);
            }

            //act
            adjectiveGroupData.FindClosestAdjective();

            //assert
            adjectiveGroupData.GetText().Should().Equals(example.Text);
        }

        [Fact]
        public void GetText_ForInvalidAdjective_ReturnsEmptyString()
        {
            //arrange
            var adjectiveGroupData = new AdjectiveGroupData("e", _commonAdjectives, 2000);

            adjectiveGroupData.AddTimeAndRank(2000, new Adjective() { Id = "oe" });
 
            //act
            adjectiveGroupData.FindClosestAdjective();

            //assert
            adjectiveGroupData.GetText().Should().Equals("");
        }

        [Fact]
        public void GetText_ForPrepareNothing_ReturnsError()
        {
            //arrange
            var adjectiveGroupData = new AdjectiveGroupData("e", _commonAdjectives, 2000);
            var exception=false;

            //act
            try
            {
                adjectiveGroupData.FindClosestAdjective();
            }
            catch
            {
                exception = true;
            }

            //assert
            exception.Should().BeTrue();
        }

        protected static Adjective? GetAdjective(string id) => _commonAdjectives.FirstOrDefault(a => a.Id == id);
    }
}
