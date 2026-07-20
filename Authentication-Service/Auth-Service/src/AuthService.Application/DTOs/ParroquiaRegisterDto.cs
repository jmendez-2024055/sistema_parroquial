using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class ParroquiaRegisterDto
{
    [Required(ErrorMessage = "El nombre de la parroquia es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "La dirección es obligatoria.")]
    [MaxLength(200, ErrorMessage = "La dirección no puede tener más de 200 caracteres.")]
    public string Direccion { get; set; } = string.Empty;

    [MaxLength(20, ErrorMessage = "El teléfono no puede tener más de 20 caracteres.")]
    public string? Telefono { get; set; }

    [MaxLength(100, ErrorMessage = "El email no puede tener más de 100 caracteres.")]
    public string? Email { get; set; }

    // Datos del encargado
    [Required(ErrorMessage = "El nombre del encargado es obligatorio.")]
    [MaxLength(25, ErrorMessage = "El nombre no puede tener más de 25 caracteres.")]
    public string EncargadoNombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido del encargado es obligatorio.")]
    [MaxLength(25, ErrorMessage = "El apellido no puede tener más de 25 caracteres.")]
    public string EncargadoApellido { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre de usuario del encargado es obligatorio.")]
    [MaxLength(50, ErrorMessage = "El nombre de usuario no puede tener más de 50 caracteres.")]
    public string EncargadoUsername { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo del encargado es obligatorio.")]
    [EmailAddress(ErrorMessage = "El correo electrónico no tiene un formato válido.")]
    [MaxLength(150, ErrorMessage = "El correo electrónico no puede tener más de 150 caracteres.")]
    public string EncargadoEmail { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña del encargado es obligatoria.")]
    [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
    [MaxLength(255, ErrorMessage = "La contraseña no puede tener más de 255 caracteres.")]
    public string EncargadoPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono del encargado es obligatorio.")]
    [StringLength(8, MinimumLength = 8, ErrorMessage = "El teléfono debe tener 8 caracteres.")]
    public string EncargadoTelefono { get; set; } = string.Empty;
}
