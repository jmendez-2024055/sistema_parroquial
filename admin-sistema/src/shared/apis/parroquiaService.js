import { axiosAuth } from './api.js';

// ── Registrar Parroquia ────
export const registerParroquiaRequest = async (data) => {
  const response = await axiosAuth.post('/parroquias/register', data);
  return response.data;
};

// ── Verificar Parroquia ────
export const verifyParroquiaRequest = async (token) => {
  const response = await axiosAuth.post('/parroquias/verify', null, {
    params: { token }
  });
  return response.data;
};

// ── Obtener todas las parroquias ────
export const getAllParroquiasRequest = async () => {
  const response = await axiosAuth.get('/parroquias');
  return response.data;
};

// ── Obtener parroquias verificadas ────
export const getVerifiedParroquiasRequest = async () => {
  const response = await axiosAuth.get('/parroquias/verified');
  return response.data;
};
