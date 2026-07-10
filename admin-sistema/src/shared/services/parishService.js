import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const BASE_PATH = '/SistemaParroquial/v1/parroquias';

export const parishService = {
  // Obtener todas las parroquias
  getAllParishes: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${BASE_PATH}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener parroquias:', error);
      throw error;
    }
  },

  // Obtener parroquia por ID
  getParishById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener parroquia:', error);
      throw error;
    }
  },

  // Encontrar parroquia más cercana
  findNearestParish: async (lat, lon, maxDistance = 50) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${BASE_PATH}/nearest`, {
        params: { lat, lon, maxDistance }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar parroquia más cercana:', error);
      throw error;
    }
  },

  // Buscar parroquias dentro de un radio
  findParishesWithinRadius: async (lat, lon, radius = 50) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${BASE_PATH}/nearby`, {
        params: { lat, lon, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar parroquias en el radio:', error);
      throw error;
    }
  },

  // Descubrir parroquias cercanas combinando base de datos y Overpass
  discoverNearbyParishes: async (lat, lon, radius = 5000) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${BASE_PATH}/discover`, {
        params: { lat, lon, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error al descubrir parroquias cercanas:', error);
      throw error;
    }
  },

  // Reclamar o crear parroquia desde un candidato de Overpass
  claimParish: async ({ osmId, nombre, direccion, latitud, longitud }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${BASE_PATH}/claim`, {
        osmId,
        nombre,
        direccion,
        latitud,
        longitud
      });
      return response.data;
    } catch (error) {
      console.error('Error al reclamar parroquia:', error);
      throw error;
    }
  },

  // Crear nueva parroquia
  createParish: async (parishData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${BASE_PATH}`, parishData);
      return response.data;
    } catch (error) {
      console.error('Error al crear parroquia:', error);
      throw error;
    }
  },

  // Actualizar parroquia
  updateParish: async (id, parishData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}${BASE_PATH}/${id}`, parishData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar parroquia:', error);
      throw error;
    }
  },

  // Eliminar parroquia
  deleteParish: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar parroquia:', error);
      throw error;
    }
  }
};
