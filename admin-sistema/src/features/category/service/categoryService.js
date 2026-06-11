import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const categoriaApi = axios.create({ baseURL: `${API}/categorias` });

export const getCategorias = () => categoriaApi.get('/');
export const getCategoriaById = (id) => categoriaApi.get(`/${id}`);
export const createCategoria = (data) => categoriaApi.post('/', data);
export const updateCategoria = (id, data) => categoriaApi.put(`/${id}`, data);
export const deleteCategoria = (id) => categoriaApi.delete(`/${id}`);
