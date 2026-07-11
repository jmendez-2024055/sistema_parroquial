import { axiosAuth } from '../apis/api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';
const BASE_PATH = '/misa';

export const massScheduleService = {
  // Obtener todos los horarios de misa
  getAllMassSchedules: async () => {
    try {
      const response = await axiosAuth.get(`${API_BASE_URL}${BASE_PATH}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener horarios de misa:', error);
      throw error;
    }
  },

  // Obtener un horario de misa por ID
  getMassScheduleById: async (id) => {
    try {
      const response = await axiosAuth.get(`${API_BASE_URL}${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener horario de misa:', error);
      throw error;
    }
  },

  // Crear un horario de misa
  createMassSchedule: async (data) => {
    try {
      const response = await axiosAuth.post(`${API_BASE_URL}${BASE_PATH}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear parroquia:', error);
      throw error;
    }
  },

  // Actualizar un horario de misa
  updateMassSchedule: async (id, data) => {
    try {
      const response = await axiosAuth.put(`${API_BASE_URL}${BASE_PATH}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar horario de misa:', error);
      throw error;
    }
  },

  // Eliminar un horario de misa
  deleteMassSchedule: async (id) => {
    try {
      const response = await axiosAuth.delete(`${API_BASE_URL}${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar horario de misa:', error);
      throw error;
    }
  }
};
