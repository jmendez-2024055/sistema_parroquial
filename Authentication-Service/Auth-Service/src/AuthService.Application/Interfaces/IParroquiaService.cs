using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IParroquiaService
{
    Task<ParroquiaRegisterResponseDto> RegisterParroquiaAsync(ParroquiaRegisterDto dto);
    Task<ParroquiaVerifyResponseDto> VerifyParroquiaAsync(string token);
    Task<IEnumerable<ParroquiaDto>> GetAllParroquiasAsync();
    Task<IEnumerable<ParroquiaDto>> GetVerifiedParroquiasAsync();
}
