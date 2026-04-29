using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers
{
    /// <summary>
    /// Controlador para verificar el estado básico del servicio
    /// </summary>
    [ApiController]
    [Route("api/health")]
    [Produces("application/json")]
    public class HealthController : ControllerBase
    {
        /// <summary>
        /// Verifica si el servicio está activo
        /// </summary>
        /// <remarks>
        /// Endpoint simple para comprobar que la API está funcionando correctamente.
        /// No realiza validaciones de dependencias externas como base de datos.
        /// </remarks>
        /// <returns>Estado del servicio</returns>
        /// <response code="200">Servicio activo</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Get()
        {
            return Ok(new
            {
                success = true,
                status = "ok",
                timestamp = DateTime.UtcNow
            });
        }
    }
}