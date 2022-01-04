﻿using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Controllers.Helpers.Structures
{
    public class PointMoveModel
    {
        public PointGPSDto Coordinates { get; set; }
        public int MountainPointId { get; set; }    
    }
}
