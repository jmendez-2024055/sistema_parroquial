import { axiosAuth } from '../../../shared/apis/api.js';

// ── Usuarios ────
export const getUsers = () => axiosAuth.get('/auth/users');
export const getUserById = (userId) => axiosAuth.post('/auth/profile/by-id', { userId });
export const createUser = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    // Se excluyen null y undefined explícitamente: FormData los convierte
    // al texto literal "null"/"undefined", lo que rompe el binding de
    // campos nullable (Latitude, Longitude, ParishId) en el backend .NET.
    if (value !== undefined && value !== null && value !== '') {
      form.append(key, value);
    }
  });
  return axiosAuth.post('/auth/register', form);
};
export const updateUserRole = (userId, roleName) => axiosAuth.put(`/users/${userId}/role`, { RoleName: roleName });
export const getUsersByRole = (roleName) => axiosAuth.get(`/users/by-role/${roleName}`);
export const getUserRoles = (userId) => axiosAuth.get(`/users/${userId}/roles`);
