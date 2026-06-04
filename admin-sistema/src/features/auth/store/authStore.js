import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest } from '../../../shared/apis/authService.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,          
      token: null,         
      isAuthenticated: false,
      isLoadingAuth: true, 
      loading: false,
      error: null,

      checkAuth: () => {
        const token = get().token;
        set({
          isLoadingAuth: false,
          isAuthenticated: Boolean(token),
        });
      },


      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: true }),
      clearError: () => set({ error: null }),


      login: async ({ username, password }) => {
        try {
          set({ loading: true, error: null });

          const data = await loginRequest({ username, password });

          if (!data.success) {
            set({ error: data.message || 'Credenciales inválidas', loading: false });
            return { success: false, error: data.message };
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true, user: data.user };
        } catch (err) {
          const message =
            err.response?.data?.message || 'Error al conectar con el servidor';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoadingAuth: false,
          loading: false,
          error: null,
        });
      },
    }),

    {
      name: 'auth-storage-parroquial', 
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);