using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using System.Threading.Tasks;

namespace TatraRidgesAPI.IntegrationTests.Helpers
{
    public class FakeUserFilter : IAsyncActionFilter
    {
        private readonly UserRole _role;
        public FakeUserFilter(UserRole role)=>_role=role;
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var claimsPrincipal = new ClaimsPrincipal();

            claimsPrincipal.AddIdentity(new ClaimsIdentity(
              new[]
              {
                  new Claim(ClaimTypes.NameIdentifier,"1"),
                  new Claim(ClaimTypes.Role,_role.ToString()),
              }));

            context.HttpContext.User = claimsPrincipal;

            await next();
        }
    }
}
