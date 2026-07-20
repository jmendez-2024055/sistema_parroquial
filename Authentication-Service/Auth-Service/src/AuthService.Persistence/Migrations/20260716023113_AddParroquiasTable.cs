using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthService.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddParroquiasTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "parroquia_id",
                table: "users",
                type: "character varying(16)",
                maxLength: 16,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "parroquias",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    direccion = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    verification_status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "PENDING"),
                    verification_token = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    verification_token_expiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    encargado_nombre = table.Column<string>(type: "character varying(25)", maxLength: 25, nullable: true),
                    encargado_apellido = table.Column<string>(type: "character varying(25)", maxLength: 25, nullable: true),
                    encargado_username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    encargado_email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    encargado_password = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    encargado_telefono = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: true),
                    encargado_id = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_parroquias", x => x.id);
                    table.ForeignKey(
                        name: "fk_parroquias_users_encargado_id",
                        column: x => x.encargado_id,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "ix_users_parroquia_id",
                table: "users",
                column: "parroquia_id");

            migrationBuilder.CreateIndex(
                name: "ix_parroquias_encargado_id",
                table: "parroquias",
                column: "encargado_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_users_parroquias_parroquia_id",
                table: "users",
                column: "parroquia_id",
                principalTable: "parroquias",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_users_parroquias_parroquia_id",
                table: "users");

            migrationBuilder.DropTable(
                name: "parroquias");

            migrationBuilder.DropIndex(
                name: "ix_users_parroquia_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "parroquia_id",
                table: "users");
        }
    }
}
