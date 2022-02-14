using Microsoft.AspNetCore.Mvc.Testing;
using System.Linq;
using TatraRidges.Model.Entities;

namespace TatraRidgesAPI.IntegrationTests.Helpers.DataContext
{
    public class AccountsTester : TatraDbTester
    {
        public AccountsTester(WebApplicationFactory<Startup> factory) : base(factory) { }

        public void RemoveUser(string email)
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var user = dbContext.Users.FirstOrDefault(u => u.Email == email);

            if (user != null)
            {
                dbContext.Users.Remove(user);
                dbContext.SaveChanges();
            }
        }
        public User GetExistingAccount()
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var user = GetUser();
            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            return user;
        }

        private User GetUser()
        {
            using var scope = GetScope();
            var dbContext = GetDbContext(scope);

            var id = dbContext.Users.Any() ? dbContext.Users.Max(u => u.Id) + 1 : 0;

            return new User()
            {

                Email = $"test3{id}@gft.com",
                Id = id,
                Nick = "Test",
                PasswordHash = "yyyyyyyy",
                RoleId = 0
            };
        }
    }
}
