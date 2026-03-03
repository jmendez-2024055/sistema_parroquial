using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AuthService.Persistence.Migrations;

/// <inheritdoc />
public partial class UsuarioSimplificado : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "roles",
            columns: table => new
            {
                id_rol = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                nombre = table.Column<string>(type: "character varying(35)", maxLength: 35, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_roles", x => x.id_rol);
            });

        migrationBuilder.CreateTable(
            name: "usuarios",
            columns: table => new
            {
                id_usuario = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                apellido = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                correo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                contrasena = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                fecha_registro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                id_rol = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_usuarios", x => x.id_usuario);
                table.ForeignKey(
                    name: "fk_usuarios_roles_id_rol",
                    column: x => x.id_rol,
                    principalTable: "roles",
                    principalColumn: "id_rol",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "ix_usuarios_correo",
            table: "usuarios",
            column: "correo",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "ix_usuarios_id_rol",
            table: "usuarios",
            column: "id_rol");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "usuarios");
        migrationBuilder.DropTable(name: "roles");
    }
}
