using FluentAssertions;
using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Procedures;
using Xunit;

namespace Tatra.RidgesModel.UnitTests.Procedures
{
    public class MountainPointValidatorTests
    {
        public static IEnumerable<object[]> GetCorrectCoordinates()
        {
            var list = new List<PointGPSDto>()
            {
                new PointGPSDto(){Latitude=49.12m,Longitude=19.91m },
                new PointGPSDto(){Latitude=49.21m,Longitude=19.91m },
                new PointGPSDto(){Latitude=49.29m,Longitude=19.91m },
                new PointGPSDto(){Latitude=49.12m,Longitude=20.29m },
                new PointGPSDto(){Latitude=49.13m,Longitude=20.29m },
                new PointGPSDto(){Latitude=49.29m,Longitude=20.29m },
                new PointGPSDto(){Latitude=49.2m,Longitude=20m }
            };

            return list.Select(q => new object[] { q });
        }

        public static IEnumerable<object[]> GetInvalidCoordinates()
        {
            var list = new List<PointGPSDto>()
            {
                new PointGPSDto(){Latitude=49.1m,Longitude=19.91m },
                new PointGPSDto(){Latitude=-49.21m,Longitude=19.91m },
                new PointGPSDto(){Latitude=-49.29m,Longitude=-19.91m },
                new PointGPSDto(){Latitude=49.12m,Longitude=-20.29m },
                new PointGPSDto(){Latitude=49.13m,Longitude=20.29001m },
                new PointGPSDto(){Latitude=49.29m,Longitude=20.29001m },
                new PointGPSDto(){Latitude=49.119999m,Longitude=20m }
            };
            return list.Select(q => new object[] { q });
        }

        [Theory]
        [MemberData(nameof(GetCorrectCoordinates))]
        public void IsCoordinatesValid_SetCorrectValue_RetursTrue(PointGPSDto coordinates)
        {
            //act
            var result= IsCoordinatesValid(coordinates);

            //assert
            Assert.True(result, InfoForCoordinates(coordinates));
        }

        [Theory]
        [MemberData(nameof(GetInvalidCoordinates))]
        public void IsCoordinatesValid_SetInValidValue_RetursFalse(PointGPSDto coordinates)
        {
            //act
            var result = IsCoordinatesValid(coordinates);

            //assert
            Assert.False(result, InfoForCoordinates(coordinates));
        }

        [Theory]
        [MemberData(nameof(GetCorrectCoordinates))]
        public void ErrorMessage_SetCorrectValue_RetursEmptyString(PointGPSDto coordinates)
        {
            //act
            var result = ErrorMessage(coordinates);

            //assert
            result.Should().BeEmpty();
        }

        [Theory]
        [MemberData(nameof(GetInvalidCoordinates))]
        public void ErrorMessage_SetInvalidValue_RetursNotEmptyString(PointGPSDto coordinates)
        {
            //act
            var result = ErrorMessage(coordinates);

            //assert
            result.Should().NotBeEmpty();
        }


        private static bool IsCoordinatesValid(PointGPSDto coordinates)
        {
            //arrange
            var validator = new MountainPointValidator(coordinates);

            return validator.IsCoordinatesValid();
        }

        private static string ErrorMessage(PointGPSDto coordinates)
        {
            //arrange
            var validator = new MountainPointValidator(coordinates);

            return validator.ErrorMessage();
        }

        private static string InfoForCoordinates(PointGPSDto coordinates) => $"Coordinates: {coordinates.Latitude}, {coordinates.Longitude}";
    }
}
