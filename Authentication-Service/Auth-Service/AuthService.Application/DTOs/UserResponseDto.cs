namespace AuthService.Application.DTOs;

public class UserResponseDto
{
    public int IdUsuario { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public DateTime FechaRegistro { get; set; }
    public string Rol { get; set; } = string.Empty;
}
