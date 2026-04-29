using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AuthService.Api.Controllers
{
    /// <summary>
    /// Controlador para operaciones administrativas y validación de identidad
    /// </summary>
    [ApiController]
    [Route("api/admin")]
    [Produces("application/json")]
    public class AdminController : ControllerBase
    {
        /// <summary>
        /// Obtiene la información del usuario autenticado
        /// </summary>
        /// <remarks>
        /// Requiere un token JWT válido en el header:
        /// 
        ///     Authorization: Bearer {token}
        /// 
        /// Retorna los datos básicos del usuario extraídos de los claims del token.
        /// </remarks>
        /// <returns>Información del usuario autenticado</returns>
        /// <response code="200">Información obtenida correctamente</response>
        /// <response code="401">No autorizado (token inválido o ausente)</response>
        [Authorize]
        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Me()
        {
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var username = User.FindFirstValue(JwtRegisteredClaimNames.UniqueName);
            var role = User.FindFirstValue("role");

            return Ok(new
            {
                success = true,
                sub,
                username,
                role
            });
        }

        /// <summary>
        /// Endpoint exclusivo para usuarios con rol ADMIN
        /// </summary>
        /// <remarks>
        /// Requiere autenticación mediante JWT y que el usuario tenga el rol:
        /// 
        ///     ADMIN_ROLE
        /// 
        /// Header requerido:
        /// 
        ///     Authorization: Bearer {token}
        /// </remarks>
        /// <returns>Mensaje de acceso autorizado</returns>
        /// <response code="200">Acceso permitido</response>
        /// <response code="401">No autenticado</response>
        /// <response code="403">Acceso denegado (sin permisos)</response>
        [Authorize(Roles = "ADMIN_ROLE")]
        [HttpGet("only-admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult OnlyAdmin()
        {
            return Ok(new
            {
                success = true,
                message = "Acceso permitido: ADMIN_ROLE"
            });
        }
    }
}