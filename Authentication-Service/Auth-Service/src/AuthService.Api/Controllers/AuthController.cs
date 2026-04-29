using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers
{
    /// <summary>
    /// Controlador encargado de la autenticación de usuarios
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        /// <summary>
        /// Constructor del controlador de autenticación
        /// </summary>
        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        /// <summary>
        /// Inicia sesión de un usuario
        /// </summary>
        /// <remarks>
        /// Recibe las credenciales del usuario y retorna un resultado de autenticación.
        /// 
        /// Ejemplo de request:
        /// 
        ///     POST /api/auth/login
        ///     Content-Type: multipart/form-data
        ///     
        ///     username: usuario
        ///     password: contraseña
        /// </remarks>
        /// <param name="dto">Credenciales del usuario</param>
        /// <returns>Resultado de autenticación</returns>
        /// <response code="200">Autenticación exitosa</response>
        /// <response code="401">Credenciales inválidas</response>
        [HttpPost("login")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Login([FromForm] LoginDto dto)
        {
            var result = _auth.Login(dto);
            return result.Success ? Ok(result) : Unauthorized(result);
        }

        /// <summary>
        /// Registra un nuevo usuario
        /// </summary>
        /// <remarks>
        /// Crea una nueva cuenta de usuario en el sistema.
        /// 
        /// Ejemplo de request:
        /// 
        ///     POST /api/auth/register
        ///     Content-Type: multipart/form-data
        ///     
        ///     username: nuevoUsuario
        ///     password: contraseña
        ///     email: correo@ejemplo.com
        /// </remarks>
        /// <param name="dto">Datos del usuario a registrar</param>
        /// <returns>Resultado del registro</returns>
        /// <response code="200">Registro exitoso</response>
        /// <response code="400">Datos inválidos</response>
        [HttpPost("register")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Register([FromForm] RegisterDto dto)
        {
            var result = _auth.Register(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}