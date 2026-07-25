using log4net;
using log4net.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ChanDoanXray.Constants;
using ChanDoanXray.Filters;
using ChanDoanXray.Mappers;
using ChanDoanXray.Models;
using ChanDoanXray.Services;
using ChanDoanXray.Utils;
using System.Text;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// configure log system
XmlConfigurator.Configure(new FileInfo("log4net.xml"));

// Get rid of error of ExcelDataReader
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

// Add services to the container.
builder.Services.AddScoped<IBenhNhanService, BenhNhanService>();
builder.Services.AddScoped<ITiepNhanService, TiepNhanService>();
builder.Services.AddScoped<ILinkFileService, LinkFileService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INhanVienService, NhanVienService>();


//Mappers
builder.Services.AddScoped<ILinkFileMapper, LinkFileMapper>();
builder.Services.AddScoped<IBenhNhanMapper, BenhNhanMapper>();
builder.Services.AddScoped<IUserMapper, UserMapper>();
builder.Services.AddScoped<ITiepNhanMapper, TiepNhanMapper>();
builder.Services.AddScoped<INhanVienMapper, NhanVienMapper>();
builder.Services.AddControllersWithViews();

//Utils
builder.Services.AddScoped<IFileUtils, FileUtils>();

//Configuration
var dbConnection = builder.Configuration.GetConnectionString("QLDTConnection");
var secretKey = builder.Configuration.GetValue<string>("Application:Auth:SecretKey");
var issuer = builder.Configuration.GetValue<string>("Application:Auth:Issuer");

builder.Services.AddDbContext<XrayContext>(options =>
    options.UseSqlServer(dbConnection,
        providerOptions => providerOptions.EnableRetryOnFailure()));
builder.Services.AddHttpClient();
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .WithExposedHeaders("X-Pagination");
                      });
});
builder.Services.AddControllers(options =>
{
    options.Filters.Add<HttpResponseExceptionFilter>();
});;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = issuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicy.RoleBasedPolicy, policy => policy.RequireClaim(JWTClaims.ROLES));

});
builder.Services.AddHttpContextAccessor();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
var uploadsPath = Path.GetFullPath(builder.Configuration.GetValue<string>("Application:UploadDir"));
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseStaticFiles();

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

ILog _logger = LogManager.GetLogger(typeof(WebApplication));
_logger.Info("Application has been started.");
app.Run();
