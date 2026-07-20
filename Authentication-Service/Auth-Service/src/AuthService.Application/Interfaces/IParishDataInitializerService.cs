namespace AuthService.Application.Interfaces;

public interface IParishDataInitializerService
{
    Task InitializeDefaultDataAsync(string parishAdminToken);
}
