import axios from 'axios';
import { useAuthStore } from '../../auth/store/authStore.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const categoriaApi = axios.create({ baseURL: `${API}/categorias` });

// Agregar interceptor para incluir el token en las peticiones
categoriaApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agregar interceptor para manejar errores 401
categoriaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Error 401 - Token expirado o inválido. Por favor, inicia sesión nuevamente.');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getCategorias = () => categoriaApi.get('/');
export const getCategoriaById = (id) => categoriaApi.get(`/${id}`);
export const createCategoria = (data) => categoriaApi.post('/', data);
export const updateCategoria = (id, data) => categoriaApi.put(`/${id}`, data);
export const deleteCategoria = (id) => categoriaApi.delete(`/${id}`);
export const initializeCategorias = () => categoriaApi.post('/initialize');
