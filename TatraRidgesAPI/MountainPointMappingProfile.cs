using AutoMapper;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI
{
    public class MountainPointMappingProfile:Profile
    {
        public MountainPointMappingProfile()
        {
            CreateMap<MountainPoint, MountainPointBasicDto>()
                .ForMember(p => p.PointTypeName, t => t.MapFrom(s => s.PointType.Name));
        }
    }
}
