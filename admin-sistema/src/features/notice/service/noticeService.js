import axios from 'axios';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const noticeApi = axios.create({ baseURL: `${API}/avisos` });

// Interceptor para agregar token JWT
noticeApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNotices = () => noticeApi.get('/');

export const getNoticeById = (id) => noticeApi.get(`/${id}`);

export const createNotice = (data) => noticeApi.post('/', data);

export const updateNotice = (id, data) => noticeApi.put(`/${id}`, data);

export const deleteNotice = (id) => noticeApi.delete(`/${id}`);
