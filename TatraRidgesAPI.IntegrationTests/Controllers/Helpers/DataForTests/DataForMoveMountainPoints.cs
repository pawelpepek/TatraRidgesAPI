using System.Collections.Generic;
using System.Linq;
using TatraRidges.Model.Dtos;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Helpers.DataForTests
{
    public static class DataForMoveMountainPoints
    {
        public static IEnumerable<object[]> GetValidPointGPS()
        {
            return new List<PointGPSDto>()
            {
                new PointGPSDto()
                {
                    Latitude =49.12m,
                    Longitude =19.91m
                },
                new PointGPSDto()
                {
                    Latitude =49.29m,
                    Longitude = 20.29m
                },
                new PointGPSDto()
                {
                    Latitude =49.12m,
                    Longitude =20.29m
                },
                new PointGPSDto()
                {
                    Latitude =49.29m,
                    Longitude = 19.91m
                },
                new PointGPSDto()
                {
                    Latitude =49.2m,
                    Longitude =20m
                },
                new PointGPSDto()
                {
                    Latitude =49.29m,
                    Longitude = 20.1m
                }
            }.Select(q => new object[] { q });
        }
        public static IEnumerable<object[]> GetInvalidPointGPS()
        {
            return new List<PointGPSDto>()
            {
                new PointGPSDto()
                {
                    Latitude =49.11999m,
                    Longitude =19.9m
                },
                new PointGPSDto()
                {
                    Latitude =49.2901m,
                    Longitude = 20.29m
                },
                new PointGPSDto()
                {
                    Latitude =49.12m,
                    Longitude =20.2901m
                },
                new PointGPSDto()
                {
                    Latitude =49.2901m,
                    Longitude = 19.91m
                },
                new PointGPSDto()
                {
                    Latitude =49.2m,
                    Longitude =-19.91m
                },
                new PointGPSDto()
                {
                    Latitude =-49.2m,
                    Longitude = 201m
                }
            }.Select(q => new object[] { q });
        }
    }
}
