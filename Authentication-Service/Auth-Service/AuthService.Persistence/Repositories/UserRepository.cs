using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{
    public async Task<User> CreateAsync(User user)
    {
        context.Usuarios.Add(user);
        await context.SaveChangesAsync();
        return await GetByIdAsync(user.IdUsuario)
               ?? throw new InvalidOperationException("Error al crear el usuario");
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await context.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(u => u.IdUsuario == id);
    }

    public async Task<User?> GetByCorreoAsync(string correo)
    {
        return await context.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(u => u.Correo == correo.ToLowerInvariant());
    }

    public async Task<bool> ExistsByCorreoAsync(string correo)
    {
        return await context.Usuarios
            .AnyAsync(u => u.Correo == correo.ToLowerInvariant());
    }

    public async Task<User> UpdateAsync(User user)
    {
        context.Usuarios.Update(user);
        await context.SaveChangesAsync();
        return await GetByIdAsync(user.IdUsuario)
               ?? throw new InvalidOperationException("Error al actualizar el usuario");
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await GetByIdAsync(id);
        if (user == null) return false;
        context.Usuarios.Remove(user);
        await context.SaveChangesAsync();
        return true;
    }
}
