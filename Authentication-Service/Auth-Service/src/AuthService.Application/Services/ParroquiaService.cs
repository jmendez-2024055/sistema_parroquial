using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Application.Exceptions;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class ParroquiaService(
    IParroquiaRepository parroquiaRepository,
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IPasswordHashService passwordHashService,
    IEmailService emailService,
    IJwtTokenService jwtTokenService,
    IParishDataInitializerService parishDataInitializerService,
    ILogger<ParroquiaService> logger) : IParroquiaService
{
    public async Task<ParroquiaRegisterResponseDto> RegisterParroquiaAsync(ParroquiaRegisterDto dto)
    {
        // Verificar si ya existe una parroquia con el mismo nombre
        if (await parroquiaRepository.ExistsByNameAsync(dto.Nombre))
        {
            logger.LogWarning("Parroquia with name {Nombre} already exists", dto.Nombre);
            throw new BusinessException(ErrorCodes.ENTITY_ALREADY_EXISTS, "Ya existe una parroquia con ese nombre");
        }

        // Verificar si el email del encargado ya existe
        if (await userRepository.ExistsByEmailAsync(dto.EncargadoEmail))
        {
            logger.LogWarning("Email {Email} already exists for encargado", dto.EncargadoEmail);
            throw new BusinessException(ErrorCodes.EMAIL_ALREADY_EXISTS, "El correo del encargado ya está registrado");
        }

        // Verificar si el username del encargado ya existe
        if (await userRepository.ExistsByUsernameAsync(dto.EncargadoUsername))
        {
            logger.LogWarning("Username {Username} already exists for encargado", dto.EncargadoUsername);
            throw new BusinessException(ErrorCodes.USERNAME_ALREADY_EXISTS, "El nombre de usuario del encargado ya está registrado");
        }

        // Generar IDs
        var parroquiaId = UuidGenerator.GenerateUserId();
        var verificationToken = TokenGenerator.GenerateEmailVerificationToken();

        // Crear parroquia con datos temporales del encargado
        var parroquia = new Parroquia
        {
            Id = parroquiaId,
            Nombre = dto.Nombre,
            Direccion = dto.Direccion,
            Telefono = dto.Telefono,
            Email = dto.Email,
            VerificationStatus = "PENDING",
            VerificationToken = verificationToken,
            VerificationTokenExpiry = DateTime.UtcNow.AddHours(24),
            // Guardar datos temporales del encargado
            EncargadoNombre = dto.EncargadoNombre,
            EncargadoApellido = dto.EncargadoApellido,
            EncargadoUsername = dto.EncargadoUsername,
            EncargadoEmail = dto.EncargadoEmail,
            EncargadoPassword = passwordHashService.HashPassword(dto.EncargadoPassword),
            EncargadoTelefono = dto.EncargadoTelefono,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Guardar parroquia
        var createdParroquia = await parroquiaRepository.CreateAsync(parroquia);

        logger.LogInformation("Parroquia {ParroquiaId} created successfully", parroquiaId);

        // Enviar email de verificación al encargado
        _ = Task.Run(async () =>
        {
            try
            {
                await emailService.SendParroquiaVerificationEmailAsync(
                    dto.EncargadoEmail,
                    dto.EncargadoUsername,
                    dto.Nombre,
                    verificationToken
                );
                logger.LogInformation("Parroquia verification email sent to {Email}", dto.EncargadoEmail);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send parroquia verification email to {Email}", dto.EncargadoEmail);
            }
        });

        return new ParroquiaRegisterResponseDto
        {
            Success = true,
            Message = "Parroquia registrada exitosamente. Se ha enviado un correo de verificación al encargado.",
            Parroquia = MapToParroquiaDto(createdParroquia)
        };
    }

    public async Task<ParroquiaVerifyResponseDto> VerifyParroquiaAsync(string token)
    {
        // Buscar parroquia por token de verificación
        var parroquia = await parroquiaRepository.GetByVerificationTokenAsync(token);
        if (parroquia == null)
        {
            logger.LogWarning("Invalid verification token for parroquia");
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "Token de verificación inválido"
            };
        }

        // Verificar si el token ha expirado
        if (parroquia.VerificationTokenExpiry < DateTime.UtcNow)
        {
            logger.LogWarning("Verification token expired for parroquia {ParroquiaId}", parroquia.Id);
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "El token de verificación ha expirado"
            };
        }

        // Verificar si la parroquia ya está verificada
        if (parroquia.VerificationStatus == "VERIFIED")
        {
            logger.LogWarning("Parroquia {ParroquiaId} already verified", parroquia.Id);
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "Esta parroquia ya ha sido verificada"
            };
        }

        // Verificar que tenemos los datos del encargado
        if (string.IsNullOrEmpty(parroquia.EncargadoEmail) || string.IsNullOrEmpty(parroquia.EncargadoUsername))
        {
            logger.LogError("Missing encargado data for parroquia {ParroquiaId}", parroquia.Id);
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "Datos del encargado incompletos"
            };
        }

        // Verificar nuevamente que el email y username no existen (por si cambiaron desde el registro)
        if (await userRepository.ExistsByEmailAsync(parroquia.EncargadoEmail))
        {
            logger.LogWarning("Email {Email} already exists when verifying parroquia", parroquia.EncargadoEmail);
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "El correo del encargado ya está registrado"
            };
        }

        if (await userRepository.ExistsByUsernameAsync(parroquia.EncargadoUsername))
        {
            logger.LogWarning("Username {Username} already exists when verifying parroquia", parroquia.EncargadoUsername);
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "El nombre de usuario del encargado ya está registrado"
            };
        }

        // Crear usuario encargado con rol de ADMIN
        var userId = UuidGenerator.GenerateUserId();
        var userProfileId = UuidGenerator.GenerateUserId();
        var userEmailId = UuidGenerator.GenerateUserId();
        var userRoleId = UuidGenerator.GenerateUserId();
        var userPasswordResetId = UuidGenerator.GenerateUserId();

        // Obtener rol ADMIN
        var adminRole = await roleRepository.GetByNameAsync(RoleConstants.ADMIN_ROLE);
        if (adminRole == null)
        {
            logger.LogError("ADMIN_ROLE not found in database");
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "Error del sistema: rol de administrador no encontrado"
            };
        }

        // Crear usuario encargado
        var encargado = new User
        {
            Id = userId,
            Name = parroquia.EncargadoNombre,
            Surname = parroquia.EncargadoApellido,
            Username = parroquia.EncargadoUsername,
            Email = parroquia.EncargadoEmail.ToLowerInvariant(),
            Password = parroquia.EncargadoPassword,
            Status = true, // Usuario activo automáticamente
            ParroquiaId = parroquia.Id,
            UserProfile = new UserProfile
            {
                Id = userProfileId,
                UserId = userId,
                Phone = parroquia.EncargadoTelefono,
                ProfilePicture = string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            UserEmail = new UserEmail
            {
                Id = userEmailId,
                UserId = userId,
                EmailVerified = true, // Verificado automáticamente
                EmailVerificationToken = null,
                EmailVerificationTokenExpiry = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            UserRoles =
            [
                new UserRole
                {
                    Id = userRoleId,
                    UserId = userId,
                    RoleId = adminRole.Id
                }
            ],
            UserPasswordReset = new UserPasswordReset
            {
                Id = userPasswordResetId,
                UserId = userId,
                PasswordResetToken = null,
                PasswordResetTokenExpiry = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        try
        {
            // Guardar usuario encargado primero
            var createdUser = await userRepository.CreateAsync(encargado);
            
            // Inicializar datos por defecto de la parroquia (categorías y grupos)
            try
            {
                // Necesario cargar la navegación Role para el token
                encargado.UserRoles.First().Role = adminRole;
                
                // Generar token para llamar al servicio de inicialización
                var initToken = jwtTokenService.GenerateToken(encargado);
                
                // Llamar al servicio de inicialización de datos
                await parishDataInitializerService.InitializeDefaultDataAsync(initToken);
                
                logger.LogInformation("Datos por defecto inicializados para parroquia {ParroquiaId}", parroquia.Id);
            }
            catch (Exception initEx)
            {
                logger.LogError(initEx, "Error al inicializar datos por defecto para parroquia {ParroquiaId}, pero la verificación continúa", parroquia.Id);
                // No romper el flujo de verificación si la inicialización falla
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Database error when creating encargado user for parroquia {ParroquiaId}", parroquia.Id);
            
            // Verificar si es un error de unicidad
            if (ex.Message.Contains("duplicate key") == true || 
                ex.Message.Contains("unique constraint") == true ||
                (ex.InnerException != null && (ex.InnerException.Message.Contains("duplicate key") == true || 
                ex.InnerException.Message.Contains("unique constraint") == true)))
            {
                return new ParroquiaVerifyResponseDto
                {
                    Success = false,
                    Message = "El nombre de usuario o correo del encargado ya está registrado en el sistema"
                };
            }
            
            return new ParroquiaVerifyResponseDto
            {
                Success = false,
                Message = "Error al crear el usuario encargado: " + ex.Message
            };
        }

        // Solo actualizar parroquia si el usuario se creó exitosamente
        parroquia.VerificationStatus = "VERIFIED";
        parroquia.VerificationToken = null;
        parroquia.VerificationTokenExpiry = null;
        parroquia.EncargadoId = userId;
        // Limpiar datos temporales del encargado
        parroquia.EncargadoNombre = null;
        parroquia.EncargadoApellido = null;
        parroquia.EncargadoUsername = null;
        parroquia.EncargadoEmail = null;
        parroquia.EncargadoPassword = null;
        parroquia.EncargadoTelefono = null;
        parroquia.UpdatedAt = DateTime.UtcNow;

        await parroquiaRepository.UpdateAsync(parroquia);

        logger.LogInformation("Parroquia {ParroquiaId} verified and encargado user {UserId} created successfully", parroquia.Id, userId);

        return new ParroquiaVerifyResponseDto
        {
            Success = true,
            Message = "Parroquia verificada exitosamente. Tu cuenta de administrador ha sido creada."
        };
    }

    public async Task<IEnumerable<ParroquiaDto>> GetAllParroquiasAsync()
    {
        var parroquias = await parroquiaRepository.GetAllAsync();
        return parroquias.Select(MapToParroquiaDto);
    }

    public async Task<IEnumerable<ParroquiaDto>> GetVerifiedParroquiasAsync()
    {
        var parroquias = await parroquiaRepository.GetVerifiedAsync();
        return parroquias.Select(MapToParroquiaDto);
    }

    private static ParroquiaDto MapToParroquiaDto(Parroquia parroquia)
    {
        return new ParroquiaDto
        {
            Id = parroquia.Id,
            Nombre = parroquia.Nombre,
            Direccion = parroquia.Direccion,
            Telefono = parroquia.Telefono,
            Email = parroquia.Email,
            VerificationStatus = parroquia.VerificationStatus,
            CreatedAt = parroquia.CreatedAt,
            UpdatedAt = parroquia.UpdatedAt,
            EncargadoId = parroquia.EncargadoId,
            EncargadoNombre = parroquia.Encargado != null ? $"{parroquia.Encargado.Name} {parroquia.Encargado.Surname}" : null
        };
    }
}
