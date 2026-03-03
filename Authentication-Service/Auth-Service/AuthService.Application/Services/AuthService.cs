using AuthService.Application.DTOs;
using AuthService.Application.Extensions;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class AuthService(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IPasswordHashService passwordHashService,
    IJwtTokenService jwtTokenService,
    IConfiguration configuration,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<UserResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        if (await userRepository.ExistsByCorreoAsync(registerDto.Correo))
            throw new InvalidOperationException("El correo ya está registrado");

        // Obtener rol (por defecto USER si no se envía)
        Role? rol;
        if (registerDto.IdRol.HasValue)
        {
            rol = await roleRepository.GetByIdAsync(registerDto.IdRol.Value)
                  ?? throw new InvalidOperationException($"El rol con Id {registerDto.IdRol} no existe");
        }
        else
        {
            rol = await roleRepository.GetByNombreAsync(RoleConstants.USER_ROLE)
                  ?? throw new InvalidOperationException("Rol por defecto no encontrado");
        }

        var user = new User
        {
            Nombre = registerDto.Nombre,
            Apellido = registerDto.Apellido,
            Correo = registerDto.Correo.ToLowerInvariant(),
            Contrasena = passwordHashService.HashPassword(registerDto.Contrasena),
            FechaRegistro = DateTime.UtcNow,
            UserRoles = [ new UserRole { IdRol = rol.IdRol } ]
        };

        var createdUser = await userRepository.CreateAsync(user);
        logger.LogUserRegistered(createdUser.Correo);

        return MapToResponse(createdUser);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await userRepository.GetByCorreoAsync(loginDto.Correo.ToLowerInvariant());

        if (user == null || !passwordHashService.VerifyPassword(loginDto.Contrasena, user.Contrasena))
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        var token = jwtTokenService.GenerateToken(user);
        var expiryMinutes = int.Parse(configuration["JwtSettings:ExpiryInMinutes"] ?? "60");

        logger.LogUserLoggedIn();

        return new AuthResponseDto
        {
            Success = true,
            Message = "Login exitoso",
            Token = token,
            Usuario = MapToResponse(user),
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null) return null;
        return MapToResponse(user);
    }

    private static UserResponseDto MapToResponse(User user) => new()
    {
        IdUsuario = user.IdUsuario,
        Nombre = user.Nombre,
        Apellido = user.Apellido,
        Correo = user.Correo,
        FechaRegistro = user.FechaRegistro,
        Rol = user.UserRoles.FirstOrDefault()?.Rol?.Nombre ?? string.Empty
    };
}
