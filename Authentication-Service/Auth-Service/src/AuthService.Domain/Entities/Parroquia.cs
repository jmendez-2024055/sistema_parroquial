using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class Parroquia
{
    [Key]
    [MaxLength(16)]
    public string Id { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre de la parroquia es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "La dirección es obligatoria.")]
    [MaxLength(200, ErrorMessage = "La dirección no puede tener más de 200 caracteres.")]
    public string Direccion { get; set; } = string.Empty;

    [MaxLength(20, ErrorMessage = "El teléfono no puede tener más de 20 caracteres.")]
    public string Telefono { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "El email no puede tener más de 100 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; }

    [Required]
    public DateTime UpdatedAt { get; set; }

    // Estado de verificación de la parroquia
    // Valores posibles: PENDING, VERIFIED
    public string VerificationStatus { get; set; } = "PENDING";

    // Token de verificación para el encargado
    [MaxLength(256)]
    public string? VerificationToken { get; set; }

    public DateTime? VerificationTokenExpiry { get; set; }

    // Datos temporales del encargado (para crear usuario al verificar)
    [MaxLength(25)]
    public string? EncargadoNombre { get; set; }

    [MaxLength(25)]
    public string? EncargadoApellido { get; set; }

    [MaxLength(50)]
    public string? EncargadoUsername { get; set; }

    [MaxLength(150)]
    public string? EncargadoEmail { get; set; }

    [MaxLength(255)]
    public string? EncargadoPassword { get; set; }

    [MaxLength(8)]
    public string? EncargadoTelefono { get; set; }

    // ID del usuario encargado (admin de la parroquia)
    [MaxLength(16)]
    public string? EncargadoId { get; set; }

    // Relación de navegación
    public User? Encargado { get; set; }
    public ICollection<User> Usuarios { get; set; } = [];
}
