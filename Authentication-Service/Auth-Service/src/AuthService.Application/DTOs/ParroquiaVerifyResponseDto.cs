namespace AuthService.Application.DTOs;

public class ParroquiaVerifyResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? Username { get; set; }
}
