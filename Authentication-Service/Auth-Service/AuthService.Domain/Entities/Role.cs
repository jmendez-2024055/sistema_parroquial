using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Domain.Entities;

public class Role
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdRol { get; set; }

    [Required(ErrorMessage = "El nombre del rol es obligatorio")]
    [MaxLength(35, ErrorMessage = "El nombre del rol no puede exceder los 35 caracteres")]
    public string Nombre { get; set; } = string.Empty;

    public ICollection<User> Usuarios { get; set; } = [];
}
