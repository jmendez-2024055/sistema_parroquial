import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/SistemaParroquial/v1';

const massScheduleApi = axios.create({ baseURL: `${API}/misa` });

// Horarios de misa
export const getMassSchedules = () => massScheduleApi.get('/');
export const getMassScheduleById = (id) => massScheduleApi.get(`/${id}`);
export const createMassSchedule = (data) => massScheduleApi.post('/', data);
export const updateMassSchedule = (id, data) => massScheduleApi.put(`/${id}`, data);
export const deleteMassSchedule = (id) => massScheduleApi.delete(`/${id}`);
