using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using TatraRidges.Model.Exceptions;

namespace TatraRidgesAPI.Middleware
{
    public class ErrorHandlingMiddleware : IMiddleware
    {
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger) => _logger = logger;

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next.Invoke(context);
            }
            catch (InvalidCoordinateException invalidCoordinateException)
            {
                await HandleException(context, invalidCoordinateException, 416);
            }
            catch (CyclicRidgeException cyclicRidgeException)
            {
                await HandleException(context, cyclicRidgeException, 409);
            }
            catch (NotFoundException notFoundException)
            {
                await HandleException(context, notFoundException, 404);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                await HandleException(context, new Exception("Something went wrong"), 500);
            }
        }

        private async Task HandleException(HttpContext context, Exception exception, int statusCode)
        {
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsync(exception.Message);
        }

    }
}
