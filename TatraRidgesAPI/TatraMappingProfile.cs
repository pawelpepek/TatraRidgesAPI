using AutoMapper;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI
{
    public class TatraMappingProfile:Profile
    {
        public TatraMappingProfile()
        {
            CreateMap<MountainPoint, MountainPointBasicDto>()
                .ForMember(p => p.PointTypeName, t => t.MapFrom(s => s.PointType.Name));

            CreateMap<PointsConnection, PointsRidgeDto>();
        }
    }
}
