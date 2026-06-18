import { create } from 'zustand';
import * as userService from '../services/userService.js';

const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await userService.getUsers();
      set({ users: res.data.data || res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al obtener usuarios', loading: false });
    }
  },

  createUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await userService.createUser(data);
      await get().fetchUsers();
      set({ loading: false });
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear usuario';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateUserRole: async (userId, roleName) => {
    set({ loading: true, error: null });
    try {
      const res = await userService.updateUserRole(userId, roleName);
      await get().fetchUsers();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al actualizar rol', loading: false });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;
