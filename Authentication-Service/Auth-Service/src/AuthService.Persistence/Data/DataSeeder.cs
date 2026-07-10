using AuthService.Domain.Entities;
using AuthService.Application.Services;
using AuthService.Domain.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, IConfiguration? configuration = null, ILogger? logger = null)
    {
        // Verificar si ya existen roles
        if (!(context.Roles?.Any() ?? false))
        {
            var roles = new List<Role>
            {
                new() {
                    Id = UuidGenerator.GenerateRoleId(),
                        Name = RoleConstants.ADMIN_ROLE
                },
                new() {
                    Id = UuidGenerator.GenerateRoleId(),
                        Name = RoleConstants.USER_ROLE
                },
                new() {
                    Id = UuidGenerator.GenerateRoleId(),
                        Name = RoleConstants.SUPERADMIN_ROLE
                }
            };

            await context.Roles!.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        // Seed de un usuario administrador por defecto SOLO si no existen usuarios todavía
        if (!(await (context.Users?.AnyAsync() ?? Task.FromResult(false))))
        {
            // Buscar rol admin existente
            var adminRole = await (context.Roles ?? throw new InvalidOperationException("Roles DbSet is null.")).FirstOrDefaultAsync(r => r.Name == RoleConstants.ADMIN_ROLE);
            if (adminRole != null)
            {
                var passwordHasher = new PasswordHashService();

                var userId = UuidGenerator.GenerateUserId();
                var profileId = UuidGenerator.GenerateUserId();
                var emailId = UuidGenerator.GenerateUserId();
                var userRoleId = UuidGenerator.GenerateUserId();

                var adminUser = new User
                {
                    Id = userId,
                    Name = "Admin",
                    Surname = "User",
                    Username = "admin",
                    Email = "admin@ksports.local",
                    Password = passwordHasher.HashPassword("Admin1234!"),
                    Status = true,
                    UserProfile = new UserProfile
                    {
                        Id = profileId,
                        UserId = userId,
                        Phone = string.Empty
                    },
                    UserEmail = new UserEmail
                    {
                        Id = emailId,
                        UserId = userId,
                        EmailVerified = true,
                        EmailVerificationToken = null,
                        EmailVerificationTokenExpiry = null
                    },
                    UserRoles =
                    [
                        new UserRole
                        {
                            Id = userRoleId,
                            UserId = userId,
                            RoleId = adminRole.Id
                        }
                    ]
                };

                await context.Users!.AddAsync(adminUser);
                await context.SaveChangesAsync();
            }
        }

        // Seed de superadmin si no existe ningún usuario con SUPERADMIN_ROLE
        var superAdminRole = await (context.Roles ?? throw new InvalidOperationException("Roles DbSet is null.")).FirstOrDefaultAsync(r => r.Name == RoleConstants.SUPERADMIN_ROLE);
        if (superAdminRole != null)
        {
            var existingSuperAdmin = await (context.Users ?? throw new InvalidOperationException("Users DbSet is null."))
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.UserRoles.Any(ur => ur.RoleId == superAdminRole.Id));

            if (existingSuperAdmin == null)
            {
                var superAdminEmail = configuration?["SuperAdmin:Email"];
                var superAdminPassword = configuration?["SuperAdmin:Password"];

                if (!string.IsNullOrEmpty(superAdminEmail) && !string.IsNullOrEmpty(superAdminPassword))
                {
                    var passwordHasher = new PasswordHashService();

                    var superAdminUserId = UuidGenerator.GenerateUserId();
                    var superAdminProfileId = UuidGenerator.GenerateUserId();
                    var superAdminEmailId = UuidGenerator.GenerateUserId();
                    var superAdminUserRoleId = UuidGenerator.GenerateUserId();

                    var superAdminUser = new User
                    {
                        Id = superAdminUserId,
                        Name = "Super",
                        Surname = "Admin",
                        Username = "superadmin",
                        Email = superAdminEmail.ToLowerInvariant(),
                        Password = passwordHasher.HashPassword(superAdminPassword),
                        Status = true,
                        UserProfile = new UserProfile
                        {
                            Id = superAdminProfileId,
                            UserId = superAdminUserId,
                            Phone = string.Empty
                        },
                        UserEmail = new UserEmail
                        {
                            Id = superAdminEmailId,
                            UserId = superAdminUserId,
                            EmailVerified = true,
                            EmailVerificationToken = null,
                            EmailVerificationTokenExpiry = null
                        },
                        UserRoles =
                        [
                            new UserRole
                            {
                                Id = superAdminUserRoleId,
                                UserId = superAdminUserId,
                                RoleId = superAdminRole.Id
                            }
                        ]
                    };

                    await context.Users!.AddAsync(superAdminUser);
                    await context.SaveChangesAsync();
                    logger?.LogInformation("Superadmin user created successfully with email {Email}", superAdminEmail);
                }
                else
                {
                    logger?.LogWarning("SuperAdmin credentials not configured in appsettings. Superadmin user not created.");
                }
            }
        }
    }
}