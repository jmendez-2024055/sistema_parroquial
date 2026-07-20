using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using AuthService.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure PostgreSQL database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention());

        // Configure application services
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IParroquiaRepository, ParroquiaRepository>();
        services.AddScoped<IAuthService, Application.Services.AuthService>();
        services.AddScoped<IUserManagementService, UserManagementService>();
        services.AddScoped<IPasswordHashService, PasswordHashService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IParroquiaService, ParroquiaService>();
        services.AddHttpClient<IParishDataInitializerService, ParishDataInitializerService>(client =>
        {
            client.Timeout = TimeSpan.FromSeconds(10);
        });

        // Configure health checks
        services.AddHealthChecks();

        return services;
    }

    public static IServiceCollection AddApiDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        return services;
    }
}