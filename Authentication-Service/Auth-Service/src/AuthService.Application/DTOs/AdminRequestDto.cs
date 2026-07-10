namespace AuthService.Application.DTOs;

public class AdminRequestDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ParishId { get; set; }
    public string AdminRequestStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
