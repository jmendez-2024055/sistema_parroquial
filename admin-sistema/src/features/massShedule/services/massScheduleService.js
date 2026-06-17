import axios from 'axios';
import { useAuthStore } from '../../auth/store/authStore.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const massScheduleApi = axios.create({ baseURL: `${API}/misa` });

// Interceptor para agregar token JWT
massScheduleApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Horarios de misa
export const getMassSchedules = () => massScheduleApi.get('/');
export const getMassScheduleById = (id) => massScheduleApi.get(`/${id}`);
export const createMassSchedule = (data) => massScheduleApi.post('/', data);
export const updateMassSchedule = (id, data) => massScheduleApi.put(`/${id}`, data);
export const deleteMassSchedule = (id) => massScheduleApi.delete(`/${id}`);
