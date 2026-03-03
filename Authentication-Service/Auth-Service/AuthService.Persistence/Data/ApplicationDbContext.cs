using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Usuarios { get; set; }
    public DbSet<Role> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de Usuario
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.IdUsuario);
            entity.Property(e => e.IdUsuario).ValueGeneratedOnAdd();

            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Apellido).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Correo).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Contrasena).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FechaRegistro).IsRequired();

            // Correo único
            entity.HasIndex(e => e.Correo).IsUnique();

            // Relación con Rol (FK)
            entity.HasOne(e => e.Rol)
                  .WithMany(r => r.Usuarios)
                  .HasForeignKey(e => e.IdRol);
        });

        // Configuración de Rol
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.IdRol);
            entity.Property(e => e.IdRol).ValueGeneratedOnAdd();
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(35);
        });
    }
}
