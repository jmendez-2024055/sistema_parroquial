using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController(IUserManagementService userManagementService, IUserRepository userRepository) : ControllerBase
{
    private async Task<bool> CurrentUserIsAdmin()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) return false;
        var roles = await userManagementService.GetUserRolesAsync(userId);
        return roles.Contains(RoleConstants.ADMIN_ROLE);
    }

    private string? CurrentUserParroquiaId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "parroquiaId")?.Value;
    }

    [HttpPut("{userId}/role")]
    [Authorize]
    [EnableRateLimiting("ApiPolicy")]
    public async Task<ActionResult<UserResponseDto>> UpdateUserRole(string userId, [FromBody] UpdateUserRoleDto dto)
    {
        if (!await CurrentUserIsAdmin())
        {
            return StatusCode(403, new { success = false, message = "Forbidden" });
        }

        var requesterParroquiaId = CurrentUserParroquiaId();
        if (string.IsNullOrEmpty(requesterParroquiaId))
        {
            return StatusCode(403, new { success = false, message = "Forbidden: User has no parish assigned" });
        }

        var result = await userManagementService.UpdateUserRoleAsync(userId, dto.RoleName, requesterParroquiaId);
        return Ok(result);
    }

    [HttpGet("{userId}/roles")]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<string>>> GetUserRoles(string userId)
    {
        if (!await CurrentUserIsAdmin())
        {
            return StatusCode(403, new { success = false, message = "Forbidden" });
        }

        var requesterParroquiaId = CurrentUserParroquiaId();
        if (string.IsNullOrEmpty(requesterParroquiaId))
        {
            return StatusCode(403, new { success = false, message = "Forbidden: User has no parish assigned" });
        }

        // Verify that the target user belongs to the same parish
        var targetUser = await userRepository.GetByIdAsync(userId);
        if (targetUser.ParroquiaId != requesterParroquiaId)
        {
            return StatusCode(403, new { success = false, message = "Forbidden: Cannot access users from another parish" });
        }

        var roles = await userManagementService.GetUserRolesAsync(userId);
        return Ok(roles);
    }

    [HttpGet("by-role/{roleName}")]
    [Authorize]
    [EnableRateLimiting("ApiPolicy")]
    public async Task<ActionResult<IReadOnlyList<UserResponseDto>>> GetUsersByRole(string roleName)
    {
        if (!await CurrentUserIsAdmin())
        {
            return StatusCode(403, new { success = false, message = "Forbidden" });
        }

        var requesterParroquiaId = CurrentUserParroquiaId();
        if (string.IsNullOrEmpty(requesterParroquiaId))
        {
            return StatusCode(403, new { success = false, message = "Forbidden: User has no parish assigned" });
        }

        var users = await userManagementService.GetUsersByRoleAsync(roleName, requesterParroquiaId);
        return Ok(users);
    }
}