import axios from 'axios';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const groupApi = axios.create({ baseURL: `${API}/grupos` });

// Interceptor para agregar token JWT
groupApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getGroups = () => groupApi.get('/');
export const getGroupById = (id) => groupApi.get(`/${id}`);
export const createGroup = (data) => groupApi.post('/', data);
export const updateGroup = (id, data) => groupApi.put(`/${id}`, data);
export const deleteGroup = (id) => groupApi.delete(`/${id}`);
