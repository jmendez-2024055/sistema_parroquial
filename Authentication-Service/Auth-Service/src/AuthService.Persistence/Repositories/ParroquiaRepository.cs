using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class ParroquiaRepository(ApplicationDbContext context) : IParroquiaRepository
{
    public async Task<Parroquia?> GetByIdAsync(string id)
    {
        return await context.Parroquias
            .Include(p => p.Encargado)
            .Include(p => p.Usuarios)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Parroquia?> GetByVerificationTokenAsync(string token)
    {
        return await context.Parroquias
            .FirstOrDefaultAsync(p => p.VerificationToken == token);
    }

    public async Task<IEnumerable<Parroquia>> GetAllAsync()
    {
        return await context.Parroquias
            .Include(p => p.Encargado)
            .ToListAsync();
    }

    public async Task<IEnumerable<Parroquia>> GetVerifiedAsync()
    {
        return await context.Parroquias
            .Where(p => p.VerificationStatus == "VERIFIED")
            .ToListAsync();
    }

    public async Task<Parroquia> CreateAsync(Parroquia parroquia)
    {
        context.Parroquias.Add(parroquia);
        await context.SaveChangesAsync();
        return parroquia;
    }

    public async Task<Parroquia> UpdateAsync(Parroquia parroquia)
    {
        context.Parroquias.Update(parroquia);
        await context.SaveChangesAsync();
        return parroquia;
    }

    public async Task<bool> ExistsByNameAsync(string nombre)
    {
        return await context.Parroquias
            .AnyAsync(p => p.Nombre == nombre);
    }
}
