using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IParroquiaRepository
{
    Task<Parroquia?> GetByIdAsync(string id);
    Task<Parroquia?> GetByVerificationTokenAsync(string token);
    Task<IEnumerable<Parroquia>> GetAllAsync();
    Task<IEnumerable<Parroquia>> GetVerifiedAsync();
    Task<Parroquia> CreateAsync(Parroquia parroquia);
    Task<Parroquia> UpdateAsync(Parroquia parroquia);
    Task<bool> ExistsByNameAsync(string nombre);
}
