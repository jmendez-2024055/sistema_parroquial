import axios from 'axios';
import { useAuthStore } from '../../auth/store/authStore.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const eventApi = axios.create({ baseURL: `${API}/eventos` });
const categoriaApi = axios.create({ baseURL: `${API}/categorias` });

// Agregar interceptor para incluir el token en las peticiones de eventos
eventApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agregar interceptor para incluir el token en las peticiones de categorías
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

// Eventos
export const getEventos = () => eventApi.get('/');
export const getEventoById = (id) => eventApi.get(`/${id}`);
export const createEvento = (data) => eventApi.post('/', data);
export const updateEvento = (id, data) => eventApi.put(`/${id}`, data);
export const deleteEvento = (id) => eventApi.delete(`/${id}`);

// Categorías
export const getCategorias = () => categoriaApi.get('/');