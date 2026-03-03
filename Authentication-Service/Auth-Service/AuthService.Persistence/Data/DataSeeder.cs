using AuthService.Application.Services;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Crear roles si no existen
        if (!await context.Roles.AnyAsync())
        {
            var roles = new List<Role>
            {
                new() { Nombre = RoleConstants.ADMIN_ROLE },
                new() { Nombre = RoleConstants.USER_ROLE }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        // Crear usuario admin si no existe
        if (!await context.Usuarios.AnyAsync())
        {
            var adminRol = await context.Roles.FirstOrDefaultAsync(r => r.Nombre == RoleConstants.ADMIN_ROLE);
            if (adminRol != null)
            {
                var passwordHasher = new PasswordHashService();

                var adminUser = new User
                {
                    Nombre = "Admin",
                    Apellido = "Sistema",
                    Correo = "admin@local.com",
                    Contrasena = passwordHasher.HashPassword("Kinal2026!"),
                    FechaRegistro = DateTime.UtcNow,
                    IdRol = adminRol.IdRol
                };

                await context.Usuarios.AddAsync(adminUser);
                await context.SaveChangesAsync();
            }
        }
    }
}
