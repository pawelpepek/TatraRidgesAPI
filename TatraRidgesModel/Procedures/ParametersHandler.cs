using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Procedures
{
    public class ParametersHandler
    {
        private readonly TatraDbContext _dbContext;

        public ParametersHandler(TatraDbContext context) => _dbContext = context;
        //public ParametersDto GetAllParameters()
        //{
        //    return new ParametersDto()
        //    {
        //        Adjectives = _dbContext.Adjectives.Select(a => new AdjectiveDto() { Id = a.Id, Text = a.Text })
        //                                          .ToList(),

        //        Guides=_dbContext.
        //    }
        //}
    }
}
