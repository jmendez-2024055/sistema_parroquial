namespace AuthService.Application.DTOs;

public class UserDetailsDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? ParroquiaId { get; set; }
    public string? ParroquiaNombre { get; set; }
}