using Microsoft.Extensions.Logging;

namespace AuthService.Application.Extensions;

public static partial class LoggerExtensions
{
    [LoggerMessage(EventId = 1001, Level = LogLevel.Information, Message = "Usuario registrado: {Correo}")]
    public static partial void LogUserRegistered(this ILogger logger, string correo);

    [LoggerMessage(EventId = 1002, Level = LogLevel.Information, Message = "Login exitoso")]
    public static partial void LogUserLoggedIn(this ILogger logger);

    [LoggerMessage(EventId = 1003, Level = LogLevel.Warning, Message = "Intento de login fallido")]
    public static partial void LogFailedLoginAttempt(this ILogger logger);

    [LoggerMessage(EventId = 1004, Level = LogLevel.Warning, Message = "Registro rechazado: correo ya existe")]
    public static partial void LogRegistrationWithExistingEmail(this ILogger logger);
}
