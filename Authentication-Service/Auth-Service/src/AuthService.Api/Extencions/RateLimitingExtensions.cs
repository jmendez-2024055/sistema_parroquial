using System;
using System.Threading.RateLimiting;

namespace AuthService.Api.Extensions;

public static class RateLimitingExtensions
{
    public static IServiceCollection AddRateLimitingPolicies(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            // Rate limiting para autenticación (aumentado para desarrollo)
            options.AddPolicy("AuthPolicy", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: partition => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = 100, // 100 intentos (aumentado de 5)
                        Window = TimeSpan.FromMinutes(1) // por minuto
                    }));

            // Rate limiting general para API (aumentado para desarrollo)
            options.AddPolicy("ApiPolicy", context =>
                RateLimitPartition.GetTokenBucketLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: partition => new TokenBucketRateLimiterOptions
                    {
                        TokenLimit = 1000, // 1000 tokens (aumentado de 100)
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 50, // (aumentado de 5)
                        ReplenishmentPeriod = TimeSpan.FromMinutes(1), // se repone cada minuto
                        TokensPerPeriod = 200, // 200 tokens por minuto (aumentado de 20)
                        AutoReplenishment = true
                    }));

            // Respuesta cuando se excede el límite
            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.StatusCode = 429;
                await context.HttpContext.Response.WriteAsync("Too Many Requests. Please try again later.", token);
            };
        });

        return services;
    }
}