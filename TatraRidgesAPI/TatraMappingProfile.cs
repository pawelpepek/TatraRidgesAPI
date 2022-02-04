using AutoMapper;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI
{
    public class TatraMappingProfile:Profile
    {
        public TatraMappingProfile()
        {
            CreateMap<MountainPoint, MountainPointDto>()
                .ForMember(p => p.PointTypeName, t => t.MapFrom(s => s.PointType.Name));

            CreateMap<PointsConnection, PointsRidgeDto>()
                .ForMember(r=>r.PointFrom,t=>t.MapFrom(s=>
                new PointGPSDto() 
                { 
                    Latitude=s.MountainPoint1.Latitude,
                    Longitude=s.MountainPoint1.Longitude
                }
                ))
               .ForMember(r => r.PointTo, t => t.MapFrom(s =>
                     new PointGPSDto()
                     {
                         Latitude = s.MountainPoint2.Latitude,
                         Longitude = s.MountainPoint2.Longitude
                     }
                   ));
            CreateMap<PointsConnectionCreateDto, PointsConnection>();
            CreateMap<Adjective, AdjectiveDto>();
            CreateMap<Guide, GuideDto>();
            CreateMap<RouteType, RouteTypeDto>();
        }
    }
}
