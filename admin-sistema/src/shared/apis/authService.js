import { axiosAuth } from './api.js';


export const loginRequest = async ({ username, password }) => {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  const response = await axiosAuth.post('/auth/login', form);
  return response.data;
};


export const registerRequest = async (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') form.append(key, value);
  });

  const response = await axiosAuth.post('/auth/register', form);
  return response.data;
};


export const forgotPasswordRequest = async (email) => {
  const form = new FormData();
  form.append('email', email);
  const response = await axiosAuth.post('/auth/forgot-password', form);
  return response.data;
};


export const resetPasswordRequest = async ({ token, newPassword }) => {
  const form = new FormData();
  form.append('token', token);
  form.append('newPassword', newPassword);
  const response = await axiosAuth.post('/auth/reset-password', form);
  return response.data;
};