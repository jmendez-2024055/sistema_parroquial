using AuthService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;

namespace AuthService.Application.Services;

public class ParishDataInitializerService(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<ParishDataInitializerService> logger) : IParishDataInitializerService
{
    public async Task InitializeDefaultDataAsync(string parishAdminToken)
    {
        var baseUrl = configuration["NodeServices:BaseUrl"] ?? "http://localhost:3000/SistemaParroquial/v1";
        
        // Initialize categories
        try
        {
            var categoriesUrl = $"{baseUrl}/categorias/initialize";
            using var request = new HttpRequestMessage(HttpMethod.Post, categoriesUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", parishAdminToken);
            
            var response = await httpClient.SendAsync(request);
            
            if (response.IsSuccessStatusCode)
            {
                logger.LogInformation("Categorías inicializadas correctamente para la parroquia en {Url}", categoriesUrl);
            }
            else
            {
                logger.LogWarning("Error al inicializar categorías en {Url}. Status: {StatusCode}", categoriesUrl, response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al inicializar categorías para la parroquia");
        }
        
        // Initialize groups
        try
        {
            var groupsUrl = $"{baseUrl}/grupos/initialize";
            using var request = new HttpRequestMessage(HttpMethod.Post, groupsUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", parishAdminToken);
            
            var response = await httpClient.SendAsync(request);
            
            if (response.IsSuccessStatusCode)
            {
                logger.LogInformation("Grupos inicializados correctamente para la parroquia en {Url}", groupsUrl);
            }
            else
            {
                logger.LogWarning("Error al inicializar grupos en {Url}. Status: {StatusCode}", groupsUrl, response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al inicializar grupos para la parroquia");
        }
    }
}
