namespace AuthService.Application.Interfaces;

public interface IParishService
{
    Task<ParishDto?> FindNearestParishAsync(double latitude, double longitude, double maxDistanceKm = 50);
    Task<ParishDto?> GetParishByIdAsync(string parishId);
}

public class ParishDto
{
    public string Id { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public UbicacionDto Ubicacion { get; set; } = null!;
    public ContactoDto Contacto { get; set; } = null!;
    public double DistanciaKm { get; set; }
}

public class UbicacionDto
{
    public double Latitud { get; set; }
    public double Longitud { get; set; }
}

public class ContactoDto
{
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public string? PaginaWeb { get; set; }
}
