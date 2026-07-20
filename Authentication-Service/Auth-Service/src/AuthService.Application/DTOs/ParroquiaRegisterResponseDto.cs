namespace AuthService.Application.DTOs;

public class ParroquiaRegisterResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public ParroquiaDto? Parroquia { get; set; }
}
