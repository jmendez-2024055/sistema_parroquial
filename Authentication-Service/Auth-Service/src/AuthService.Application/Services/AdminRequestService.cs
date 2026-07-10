using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Application.Exceptions;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class AdminRequestService(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    ILogger<AdminRequestService> logger) : IAdminRequestService
{
    public async Task<IEnumerable<AdminRequestDto>> GetAdminRequestsAsync(string status)
    {
        var users = await userRepository.GetUsersAsync();
        
        var filteredUsers = users
            .Where(u => u.AdminRequestStatus == status)
            .Select(u => new AdminRequestDto
            {
                Id = u.Id,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                ParishId = u.ParishId,
                AdminRequestStatus = u.AdminRequestStatus,
                CreatedAt = u.CreatedAt
            });

        logger.LogInformation("Retrieved {Count} admin requests with status {Status}", filteredUsers.Count(), status);
        return filteredUsers;
    }

    public async Task<bool> ApproveAdminRequestAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            logger.LogWarning("User {UserId} not found for admin request approval", userId);
            throw new BusinessException(ErrorCodes.USER_NOT_FOUND, "User not found");
        }

        if (user.AdminRequestStatus != "PENDING")
        {
            logger.LogWarning("User {UserId} does not have PENDING admin request status. Current status: {Status}", userId, user.AdminRequestStatus);
            throw new BusinessException(ErrorCodes.INVALID_OPERATION, "User does not have a pending admin request");
        }

        // Get ADMIN_ROLE
        var adminRole = await roleRepository.GetByNameAsync(RoleConstants.ADMIN_ROLE);
        if (adminRole == null)
        {
            logger.LogError("ADMIN_ROLE not found in database");
            throw new InvalidOperationException("ADMIN_ROLE not found. Ensure seeding runs properly.");
        }

        // Check if user already has ADMIN_ROLE
        var hasAdminRole = user.UserRoles.Any(ur => ur.RoleId == adminRole.Id);
        if (hasAdminRole)
        {
            logger.LogWarning("User {UserId} already has ADMIN_ROLE", userId);
            throw new BusinessException(ErrorCodes.INVALID_OPERATION, "User already has admin role");
        }

        // Add ADMIN_ROLE to user
        var userRoleId = UuidGenerator.GenerateUserId();
        user.UserRoles.Add(new UserRole
        {
            Id = userRoleId,
            UserId = userId,
            RoleId = adminRole.Id
        });

        // Update admin request status
        user.AdminRequestStatus = "APPROVED";

        try
        {
            await userRepository.UpdateAsync(user);
            logger.LogInformation("Admin request approved for user {UserId}", userId);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to approve admin request for user {UserId}", userId);
            throw new BusinessException(ErrorCodes.DATABASE_ERROR, "Failed to approve admin request");
        }
    }

    public async Task<bool> RejectAdminRequestAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            logger.LogWarning("User {UserId} not found for admin request rejection", userId);
            throw new BusinessException(ErrorCodes.USER_NOT_FOUND, "User not found");
        }

        if (user.AdminRequestStatus != "PENDING")
        {
            logger.LogWarning("User {UserId} does not have PENDING admin request status. Current status: {Status}", userId, user.AdminRequestStatus);
            throw new BusinessException(ErrorCodes.INVALID_OPERATION, "User does not have a pending admin request");
        }

        // Update admin request status only - do not modify roles
        user.AdminRequestStatus = "REJECTED";

        try
        {
            await userRepository.UpdateAsync(user);
            logger.LogInformation("Admin request rejected for user {UserId}", userId);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to reject admin request for user {UserId}", userId);
            throw new BusinessException(ErrorCodes.DATABASE_ERROR, "Failed to reject admin request");
        }
    }
}
