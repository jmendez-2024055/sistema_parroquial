using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Application.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ParroquiasController : ControllerBase
{
    private readonly IParroquiaService _parroquiaService;

    public ParroquiasController(IParroquiaService parroquiaService)
    {
        _parroquiaService = parroquiaService;
    }

    [HttpPost("register")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<ParroquiaRegisterResponseDto>> RegisterParroquia([FromBody] ParroquiaRegisterDto dto)
    {
        try
        {
            var result = await _parroquiaService.RegisterParroquiaAsync(dto);
            return Ok(result);
        }
        catch (BusinessException ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message,
                errorCode = ex.ErrorCode
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Error interno del servidor al registrar la parroquia",
                error = ex.Message
            });
        }
    }

    [HttpPost("verify")]
    public async Task<ActionResult<ParroquiaVerifyResponseDto>> VerifyParroquia([FromQuery] string token)
    {
        var result = await _parroquiaService.VerifyParroquiaAsync(token);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ParroquiaDto>>> GetAllParroquias()
    {
        var parroquias = await _parroquiaService.GetAllParroquiasAsync();
        return Ok(new
        {
            success = true,
            data = parroquias
        });
    }

    [HttpGet("verified")]
    public async Task<ActionResult<IEnumerable<ParroquiaDto>>> GetVerifiedParroquias()
    {
        var parroquias = await _parroquiaService.GetVerifiedParroquiasAsync();
        return Ok(new
        {
            success = true,
            data = parroquias
        });
    }
}
