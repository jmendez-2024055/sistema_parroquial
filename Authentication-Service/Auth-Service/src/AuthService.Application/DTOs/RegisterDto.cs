using System.ComponentModel.DataAnnotations;
using AuthService.Application.Interfaces;

namespace AuthService.Application.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(25)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(25)]
    public string Surname { get; set; } = string.Empty;

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(8, MinimumLength = 8)]
    public string Phone { get; set; } = string.Empty;

    // Solicitar ser administrador de la parroquia asignada
    public bool SolicitarAdmin { get; set; } = false;

    // Coordenadas para asignar automáticamente la parroquia más cercana
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Opcional: ID de parroquia específica (si el usuario selecciona manualmente)
    public string? ParishId { get; set; }
}