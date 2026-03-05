using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<UserEmail> UserEmails { get; set; }
    public DbSet<UserPasswordReset> UserPasswordResets { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    public static string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        return string.Concat(
            input.Select((c, i) => i > 0 && char.IsUpper(c) ? "_" + c : c.ToString())
        ).ToLower();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            var tableName = entity.GetTableName();
            if (!string.IsNullOrEmpty(tableName))
                entity.SetTableName(ToSnakeCase(tableName));

            foreach (var property in entity.GetProperties())
            {
                var columnName = property.GetColumnName();
                if (!string.IsNullOrEmpty(columnName))
                    property.SetColumnName(ToSnakeCase(columnName));
            }

            foreach (var key in entity.GetKeys())
            {
                var keyName = key.GetName();
                if (!string.IsNullOrEmpty(keyName))
                    key.SetName(ToSnakeCase(keyName));
            }

            foreach (var index in entity.GetIndexes())
            {
                var indexName = index.GetDatabaseName();
                if (!string.IsNullOrEmpty(indexName))
                    index.SetDatabaseName(ToSnakeCase(indexName));
            }
        }

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(35);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            entity.HasMany(e => e.UserRoles)
                .WithOne(r => r.Role)
                .HasForeignKey(ur => ur.RoleId);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Surname)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Password)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.Status)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasMany(e => e.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId);
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(e => e.ProfilePicture)
                .HasMaxLength(255);

            entity.Property(e => e.Phone)
                .HasMaxLength(15);

            entity.HasOne(e => e.User)
                .WithOne(u => u.UserProfile)
                .HasForeignKey<UserProfile>(e => e.UserId);
        });

        modelBuilder.Entity<UserEmail>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(e => e.EmailVerified)
                .IsRequired();

            entity.Property(e => e.EmailVerificationToken)
                .HasMaxLength(256);

            entity.Property(e => e.EmailVerificationTokenExpiry);

            entity.HasOne(e => e.User)
                .WithOne(u => u.UserEmail)
                .HasForeignKey<UserEmail>(e => e.UserId);
        });

        modelBuilder.Entity<UserPasswordReset>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(e => e.PasswordResetToken)
                .HasMaxLength(256);

            entity.Property(e => e.PasswordResetTokenExpiry);

            entity.HasOne(e => e.User)
                .WithOne(u => u.UserPasswordReset)
                .HasForeignKey<UserPasswordReset>(e => e.UserId);
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(e => e.RoleId)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();
        });
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is Role role)
            {
                if (entry.State == EntityState.Added)
                    role.CreatedAt = DateTime.UtcNow;

                role.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is User user)
            {
                if (entry.State == EntityState.Added)
                    user.CreatedAt = DateTime.UtcNow;

                user.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is UserRole userRole)
            {
                if (entry.State == EntityState.Added)
                    userRole.CreatedAt = DateTime.UtcNow;

                userRole.UpdatedAt = DateTime.UtcNow;
            }
        }
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }
}