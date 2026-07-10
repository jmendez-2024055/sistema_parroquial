using AuthService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Net.Http.Json;

namespace AuthService.Application.Services;

public class ParishService : IParishService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ParishService> _logger;
    private readonly string _parishApiBaseUrl;

    public ParishService(
        HttpClient httpClient,
        ILogger<ParishService> logger,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _parishApiBaseUrl = configuration["ParishApi:BaseUrl"] ?? "http://localhost:3000";
    }

    public async Task<ParishDto?> FindNearestParishAsync(double latitude, double longitude, double maxDistanceKm = 50)
    {
        try
        {
            var url = $"{_parishApiBaseUrl}/SistemaParroquial/v1/parroquias/nearest?lat={latitude}&lon={longitude}&maxDistance={maxDistanceKm}";
            
            _logger.LogInformation("Buscando parroquia más cercana en: {Url}", url);
            
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Error al buscar parroquia más cercana. Status: {StatusCode}", response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(content);
            
            if (jsonDoc.RootElement.GetProperty("success").GetBoolean())
            {
                var dataElement = jsonDoc.RootElement.GetProperty("data");
                return new ParishDto
                {
                    Id = dataElement.GetProperty("_id").GetString() ?? string.Empty,
                    Nombre = dataElement.GetProperty("nombre").GetString() ?? string.Empty,
                    Direccion = dataElement.GetProperty("direccion").GetString() ?? string.Empty,
                    Ubicacion = new UbicacionDto
                    {
                        Latitud = dataElement.GetProperty("ubicacion").GetProperty("latitud").GetDouble(),
                        Longitud = dataElement.GetProperty("ubicacion").GetProperty("longitud").GetDouble()
                    },
                    Contacto = new ContactoDto
                    {
                        Telefono = dataElement.TryGetProperty("contacto", out var contacto) && contacto.TryGetProperty("telefono", out var telefono) ? telefono.GetString() : null,
                        Email = dataElement.TryGetProperty("contacto", out contacto) && contacto.TryGetProperty("email", out var email) ? email.GetString() : null,
                        PaginaWeb = dataElement.TryGetProperty("contacto", out contacto) && contacto.TryGetProperty("paginaWeb", out var paginaWeb) ? paginaWeb.GetString() : null
                    },
                    DistanciaKm = dataElement.TryGetProperty("distanciaKm", out var distancia) ? distancia.GetDouble() : 0
                };
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al buscar parroquia más cercana");
            return null;
        }
    }

    public async Task<ParishDto?> GetParishByIdAsync(string parishId)
    {
        try
        {
            var url = $"{_parishApiBaseUrl}/SistemaParroquial/v1/parroquias/{parishId}";
            
            _logger.LogInformation("Obteniendo parroquia por ID: {Url}", url);
            
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Error al obtener parroquia. Status: {StatusCode}", response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(content);
            
            if (jsonDoc.RootElement.GetProperty("success").GetBoolean())
            {
                var dataElement = jsonDoc.RootElement.GetProperty("data");
                return new ParishDto
                {
                    Id = dataElement.GetProperty("_id").GetString() ?? string.Empty,
                    Nombre = dataElement.GetProperty("nombre").GetString() ?? string.Empty,
                    Direccion = dataElement.GetProperty("direccion").GetString() ?? string.Empty,
                    Ubicacion = new UbicacionDto
                    {
                        Latitud = dataElement.GetProperty("ubicacion").GetProperty("latitud").GetDouble(),
                        Longitud = dataElement.GetProperty("ubicacion").GetProperty("longitud").GetDouble()
                    },
                    Contacto = new ContactoDto
                    {
                        Telefono = dataElement.TryGetProperty("contacto", out var contacto) && contacto.TryGetProperty("telefono", out var telefono) ? telefono.GetString() : null,
                        Email = dataElement.TryGetProperty("contacto", out contacto) && contacto.TryGetProperty("email", out var email) ? email.GetString() : null,
                        PaginaWeb = dataElement.TryGetProperty("contacto", out contacto) && contacto.TryGetProperty("paginaWeb", out var paginaWeb) ? paginaWeb.GetString() : null
                    },
                    DistanciaKm = 0
                };
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener parroquia por ID");
            return null;
        }
    }
}
