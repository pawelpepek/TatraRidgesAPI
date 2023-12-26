using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TatraRidges.Model.Dtos;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Seeders;
using TatraRidgesAPI.Middleware;
using TatraRidgesAPI.Services;
using TatraRidgesAPI.Validators;

namespace TatraRidgesAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var authenticationSettings = new AuthenticationSettings();
            Configuration.GetSection("Authentication").Bind(authenticationSettings);

            services.AddSingleton(authenticationSettings);
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = "Bearer";
                option.DefaultScheme = "Bearer";
                option.DefaultChallengeScheme = "Bearer";
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = authenticationSettings.JwtIssuer,
                    ValidAudience = authenticationSettings.JwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey))
                };
            }
            );

            services.AddControllers().AddFluentValidation();

            services.AddDbContext<TatraDbContext>(options => options
            .UseSqlServer(Configuration.GetConnectionString("TatraDbConnection")));

            services.AddScoped<DbSeeder>();
            services.AddAutoMapper(this.GetType().Assembly);
            services.AddScoped<IMountainPointService, MountainPointService>();
            services.AddScoped<IPointsConnectionService, PointsConnectionService>();
            services.AddScoped<IRouteService, RouteService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddScoped<IValidator<RegisteUserDto>, RegisterUserDtoValidator>();

            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            services.AddScoped<ErrorHandlingMiddleware>();
            services.AddSwaggerGen();
            services.AddCors(options =>
            {
                options.AddPolicy("FrontEndClient", builder =>
                 builder.AllowAnyMethod()
                 .AllowAnyHeader()
                 .WithOrigins(Configuration.GetConnectionString("Origins"), Configuration.GetConnectionString("OriginsPl"))
                 );
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DbSeeder seeder)
        {
            app.UseCors("FrontEndClient");
            seeder.Seed();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMiddleware<ErrorHandlingMiddleware>();

            app.UseAuthentication();
            app.UseHttpsRedirection();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "TatraRidges API");
            });

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
