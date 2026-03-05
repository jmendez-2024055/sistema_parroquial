using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IUserRepository
{
    User? GetByUsername(string username);
    User? GetByEmail(string email);
    void Add(User user);
    void Update(User user);
}