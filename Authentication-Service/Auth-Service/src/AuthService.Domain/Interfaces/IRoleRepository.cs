using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string roleName);
    Task<int> CountUsersInRoleAsync(string roleName, string parroquiaId);
    Task<IReadOnlyList<User>> GetUsersByRoleAsync(string roleName, string parroquiaId);
    Task<IReadOnlyList<string>> GetUserRoleNamesAsync(string userId);
}