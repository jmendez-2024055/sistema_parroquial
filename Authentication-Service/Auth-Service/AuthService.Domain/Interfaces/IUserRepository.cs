using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IUserRepository
{
    Task<User> CreateAsync(User user);
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByCorreoAsync(string correo);
    Task<bool> ExistsByCorreoAsync(string correo);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(int id);
}
