using log4net;
using Microsoft.AspNetCore.Mvc.Filters;
using ChanDoanXray.Exceptions;
using System.Net;
using System.Text.Json.Serialization;

namespace ChanDoanXray.Filters
{

    public class HttpResponseExceptionFilter : IExceptionFilter, IOrderedFilter
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(HttpResponseExceptionFilter));

        public int Order => int.MaxValue - 10;
        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            _logger.Error($"{exception.Message}\n{exception.StackTrace}");
            if (exception is IllegalArgumentException)
            {
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.HttpContext.Response.WriteAsJsonAsync(new CustomException()
                {
                    Message = exception.Message
                });
                return;
            }
            if (exception is FileNotFoundException)
            {
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                context.HttpContext.Response.WriteAsJsonAsync(new CustomException()
                {
                    Message = "File đính kèm không tồn tại."
                });
                return;
            }
            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.HttpContext.Response.WriteAsJsonAsync(new CustomException()
            {
                Message = "Internal server error. Please contact admin for more information."
            });
        }
    }
    public class CustomException
    {
        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}
