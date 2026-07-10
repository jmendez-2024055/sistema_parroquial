using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IAdminRequestService
{
    Task<IEnumerable<AdminRequestDto>> GetAdminRequestsAsync(string status);
    Task<bool> ApproveAdminRequestAsync(string userId);
    Task<bool> RejectAdminRequestAsync(string userId);
}
