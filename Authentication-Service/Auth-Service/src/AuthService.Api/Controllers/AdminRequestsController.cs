using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthService.Domain.Constants;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = RoleConstants.SUPERADMIN_ROLE)]
public class AdminRequestsController : ControllerBase
{
    private readonly IAdminRequestService _adminRequestService;

    public AdminRequestsController(IAdminRequestService adminRequestService)
    {
        _adminRequestService = adminRequestService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminRequestDto>>> GetAdminRequests([FromQuery] string status = "PENDING")
    {
        var requests = await _adminRequestService.GetAdminRequestsAsync(status);
        return Ok(new
        {
            success = true,
            message = $"Admin requests with status {status} retrieved successfully",
            data = requests
        });
    }

    [HttpPost("{userId}/approve")]
    public async Task<ActionResult> ApproveAdminRequest(string userId)
    {
        await _adminRequestService.ApproveAdminRequestAsync(userId);
        return Ok(new
        {
            success = true,
            message = "Admin request approved successfully"
        });
    }

    [HttpPost("{userId}/reject")]
    public async Task<ActionResult> RejectAdminRequest(string userId)
    {
        await _adminRequestService.RejectAdminRequestAsync(userId);
        return Ok(new
        {
            success = true,
            message = "Admin request rejected successfully"
        });
    }
}
