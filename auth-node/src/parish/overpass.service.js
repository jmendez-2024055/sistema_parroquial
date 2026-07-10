/**
 * Servicio para buscar iglesias católicas usando la API de Overpass (OpenStreetMap)
 */
import axios from 'axios';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Busca iglesias católicas cercanas usando la API de Overpass
 * @param {number} lat - Latitud del centro de búsqueda
 * @param {number} lon - Longitud del centro de búsqueda
 * @param {number} radiusMeters - Radio de búsqueda en metros
 * @returns {Promise<Array>} - Array de parroquias encontradas
 */
export const findNearbyCatholicChurches = async (lat, lon, radiusMeters = 5000) => {
  try {
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:${radiusMeters},${lat},${lon});
        way["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `;

    const response = await axios.post(OVERPASS_API_URL, query, {
      headers: {
        'User-Agent': 'SistemaParroquial/1.0 (contacto@tudominio.com)',
        'Content-Type': 'text/plain'
      },
      timeout: 15000
    });

    if (!response.data || !response.data.elements) {
      console.error('Overpass API: Respuesta inválida');
      return [];
    }

    const churches = response.data.elements
      .filter(element => {
        // Solo procesar elementos que tengan nombre
        return element.tags && element.tags.name;
      })
      .map(element => {
        const tags = element.tags;
        
        // Obtener coordenadas
        let latitude, longitude;
        if (element.type === 'node') {
          latitude = element.lat;
          longitude = element.lon;
        } else if (element.type === 'way' && element.center) {
          latitude = element.center.lat;
          longitude = element.center.lon;
        } else {
          return null;
        }

        // Obtener dirección
        let direccion = 'Ubicación aproximada';
        if (tags['addr:full']) {
          direccion = tags['addr:full'];
        } else if (tags['addr:street'] && tags['addr:housenumber']) {
          direccion = `${tags['addr:street']} ${tags['addr:housenumber']}`;
          if (tags['addr:city']) {
            direccion += `, ${tags['addr:city']}`;
          }
        } else if (tags['addr:street']) {
          direccion = tags['addr:street'];
          if (tags['addr:city']) {
            direccion += `, ${tags['addr:city']}`;
          }
        }

        return {
          nombre: tags.name,
          direccion,
          latitud: latitude,
          longitud: longitude,
          osmId: `${element.type}/${element.id}`,
          isClaimed: false
        };
      })
      .filter(church => church !== null);

    return churches;
  } catch (error) {
    console.error('Error al buscar iglesias católicas en Overpass:', error.message);
    // No revientas toda la búsqueda, devuelve array vacío para seguir funcionando con lo que ya está en la base de datos
    return [];
  }
};
