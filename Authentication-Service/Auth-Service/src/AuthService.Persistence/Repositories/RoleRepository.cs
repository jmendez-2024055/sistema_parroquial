using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly ApplicationDbContext _context;

    public RoleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Role?> GetByNameAsync(string roleName)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == roleName);
    }

    public async Task<int> CountUsersInRoleAsync(string roleName)
    {
        return await _context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.Role.Name == roleName)
            .CountAsync();
    }

    public async Task<IReadOnlyList<User>> GetUsersByRoleAsync(string roleName)
    {
        return await _context.UserRoles
            .Include(ur => ur.User)
            .Include(ur => ur.Role)
            .Where(ur => ur.Role.Name == roleName)
            .Select(ur => ur.User)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<string>> GetUserRoleNamesAsync(string userId)
    {
        return await _context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role.Name)
            .ToListAsync();
    }
}