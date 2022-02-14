using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using TatraRidges.Model.Dtos;
using TatraRidgesAPI.IntegrationTests.Helpers;
using TatraRidgesAPI.IntegrationTests.Helpers.DataContext;

namespace TatraRidgesAPI.IntegrationTests.Controllers.TestsBuilders.Accounts
{
    public class AccountsRegisterTestsBuilder : ControllersTestsBuilderTemplate
    {
        private static readonly string _validPassword="tPassword123";

        private bool _newUser;
        private string _email=string.Empty;
        private bool _existingEmail;
        private readonly string _password = _validPassword;
        private readonly string _confirmedPassword= _validPassword;
        private string _nick;

        private RegisteUserDto _model;

        public AccountsRegisterTestsBuilder(WebApplicationFactory<Startup> factory, HttpClient client)
            : base(factory, client) { }

        public AccountsRegisterTestsBuilder SetNewValidUser()
        {
            _newUser = true;
            return this;
        }
        public AccountsRegisterTestsBuilder SetExistingEmail()
        {
            _existingEmail = true;
            return this;
        }

        protected async override Task<HttpResponseMessage> ArrangeAndAct()
        {
            //arrange
            Arrange();

            var httpContent = _model.ToJsonHttpContent();

            //act
            return await _client.PostAsync("/api/account/register", httpContent);
        }

        protected override void AssertValues()
        {
            if (IsStatusCodeOK())
            {
                _response.Content.Should().NotBeNull();
            }
        }

        private void Arrange()
        {

            if(_existingEmail || _newUser)
            {
                var tester = new AccountsTester(_factory);

                var user = tester.GetExistingAccount();

                _email = user.Email;
                _nick = user.Nick;

                if (_newUser)
                {
                    tester.RemoveUser(_email);
                }
            }

            _model = new RegisteUserDto()
            {
                Password = _password,
                ConfirmPassword = _confirmedPassword,
                Email = _email,
                Nick = _nick
            };
        }
    }
}