using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TatraRidges.Model.Entities;
using TatraRidges.Model.Seeders;
using TatraRidgesAPI.Middleware;
using TatraRidgesAPI.Services;

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
            services.AddControllers();
            services.AddDbContext<TatraDbContext>();
            services.AddScoped<DbSeeder>();
            services.AddAutoMapper(this.GetType().Assembly);
            services.AddScoped<IMountainPointService, MountainPointService>();
            services.AddScoped<IPointsConnectionService, PointsConnectionService>();
            services.AddScoped<IRouteService, RouteService>();
            services.AddScoped<ErrorHandlingMiddleware>();
            services.AddSwaggerGen();
            services.AddCors(options =>
            {
                options.AddPolicy("FrontEndClient", builder =>
                 builder.AllowAnyMethod()
                 .AllowAnyHeader()
                 .WithOrigins("http://127.0.0.1:5500")
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
            app.UseHttpsRedirection();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "TatraRidges API");
            });

            app.UseRouting();

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
