import { axiosAuth } from '../apis/api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';
const BASE_PATH = '/intenciones';

export const intencionService = {
  // Crear una intención de misa
  crearIntencion: async (data) => {
    try {
      const response = await axiosAuth.post(`${API_BASE_URL}${BASE_PATH}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear intención:', error);
      throw error;
    }
  },

  // Obtener todas las intenciones de la parroquia del usuario
  listarIntenciones: async () => {
    try {
      const response = await axiosAuth.get(`${API_BASE_URL}${BASE_PATH}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener intenciones:', error);
      throw error;
    }
  },

  // Obtener una intención por ID
  obtenerIntencionPorId: async (id) => {
    try {
      const response = await axiosAuth.get(`${API_BASE_URL}${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener intención:', error);
      throw error;
    }
  },

  // Actualizar una intención
  actualizarIntencion: async (id, data) => {
    try {
      const { _id, __v, createdAt, updatedAt, ...cleanData } = data;
      
      const response = await axiosAuth.put(`${API_BASE_URL}${BASE_PATH}/${id}`, cleanData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        console.error('--- DETALLE DE LOS 4 ERRORES ---');
        console.table(error.response.data.errors); 
      } else {
        console.error('Error al actualizar intención:', error);
      }
      
      
      throw error;
    }
  },
  // Eliminar una intención
  eliminarIntencion: async (id) => {
    try {
      const response = await axiosAuth.delete(`${API_BASE_URL}${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar intención:', error);
      throw error;
    }
  }
};
