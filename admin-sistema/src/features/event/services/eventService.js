import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const eventApi = axios.create({ baseURL: `${API}/eventos` });
const categoriaApi = axios.create({ baseURL: `${API}/categorias` });

// Eventos
export const getEventos = () => eventApi.get('/');
export const getEventoById = (id) => eventApi.get(`/${id}`);
export const createEvento = (data) => eventApi.post('/', data);
export const updateEvento = (id, data) => eventApi.put(`/${id}`, data);
export const deleteEvento = (id) => eventApi.delete(`/${id}`);

// Categorías
export const getCategorias = () => categoriaApi.get('/');