using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers.RouteSummary;
using TatraRidges.Model.UnitTests.HelpersForTests;
using Xunit;

namespace TatraRidges.Model.UnitTests.Helpers.RouteSummer.RouteSummaryBuilderTests
{
    public class SetRouteTimeTests
    {
        public static IEnumerable<object[]> GetSamplesRanges()
        {
            var builder = new RouteBuilder();
            var list = new List<(List<RouteDto?> Routes, TimeSpan time)>()
            {
                (new List<RouteDto?>(){null,null },new TimeSpan()),
                (new List<RouteDto?>(){ RoutesExamples.GetBuilder().SetRouteTime(new TimeSpan(1, 0, 0)).Create() },new TimeSpan(1,0,0)),
                (new List<RouteDto?>(){ RoutesExamples.GetBuilder().SetRouteTime(new TimeSpan(1, 0, 0)).Create(),null},new TimeSpan(1,0,0)),
                (new List<RouteDto?>(){
                                        RoutesExamples.GetBuilder().SetRouteTime(new TimeSpan(2,0,0)).Create(),
                                        RoutesExamples.GetBuilder().Create()
                },new TimeSpan(3,0,0)),
                (new List<RouteDto?>(){
                                        RoutesExamples.GetBuilder().SetRouteTime(new TimeSpan(1,3,0)).Create(),
                                        RoutesExamples.GetBuilder().SetRouteTime(new TimeSpan(2,5,0)).Create()
                },new TimeSpan(3,8,0))
            };
            return list.Select(q => new object[] { q });
        }

        [Theory]
        [MemberData(nameof(GetSamplesRanges))]
        public void SetIsConsistentDirection_InsertSampleRoutes_RouteTimeEqualsValuFromSample((List<RouteDto?> Routes, TimeSpan Time) example)
        {
            //arrange
            var summaryBuilder = new RouteSummaryBuilder(example.Routes);

            //act
            var summary = summaryBuilder.SetRouteTime().Build();

            //assert
            summary.RouteTime.Should().Equals(example.Time);
        }
    }
}
