using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TatraRidges.Model.Dtos
{
    public class RegisteUserDto
    {
        public string Email { get; set; }
        public string Nick { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
