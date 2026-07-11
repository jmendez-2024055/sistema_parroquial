import axios from 'axios';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const groupRequestApi = axios.create({ baseURL: `${API}/solicitudes-grupos` });

// Interceptor para agregar token JWT
groupRequestApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getGroupRequests = (estado) => groupRequestApi.get('/', { params: { estado } });
export const getMyGroupRequests = () => groupRequestApi.get('/my-requests');
export const getGroupRequestById = (id) => groupRequestApi.get(`/${id}`);
export const createGroupRequest = (data) => groupRequestApi.post('/', data);
export const approveGroupRequest = (id, respuestaAdmin) => groupRequestApi.put(`/${id}/approve`, { respuestaAdmin });
export const rejectGroupRequest = (id, respuestaAdmin) => groupRequestApi.put(`/${id}/reject`, { respuestaAdmin });
export const deleteGroupRequest = (id) => groupRequestApi.delete(`/${id}`);
