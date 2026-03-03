using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class RoleRepository(ApplicationDbContext context) : IRoleRepository
{
    public async Task<Role?> GetByIdAsync(int id)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.IdRol == id);
    }

    public async Task<Role?> GetByNombreAsync(string nombre)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.Nombre == nombre);
    }
}
