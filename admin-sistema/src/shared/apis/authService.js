import { axiosAuth } from './api.js';

// ── Login ────
export const loginRequest = async ({ username, password }) => {
  const response = await axiosAuth.post('/auth/login', {
    emailOrUsername: username,
    password,
  });
  return response.data;
};

// ── Register ─────

export const registerRequest = async (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    // Se excluyen null y undefined explícitamente: FormData los convierte
    // al texto literal "null"/"undefined", lo que rompe el binding de
    // campos nullable (Latitude, Longitude, ParishId) en el backend .NET.
    if (value !== undefined && value !== null && value !== '') {
      form.append(key, value);
    }
  });
  const response = await axiosAuth.post('/auth/register', form);
  return response.data;
};

export const forgotPasswordRequest = async (email) => {
  const response = await axiosAuth.post('/auth/forgot-password', { email });
  return response.data;
};


export const resetPasswordRequest = async ({ token, newPassword }) => {
  const response = await axiosAuth.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

export const verifyEmailRequest = async ({ token }) => {
  const response = await axiosAuth.post('/auth/verify-email', { token });
  return response.data;
};