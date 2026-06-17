import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest, registerRequest } from '../../../shared/apis/authService.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoadingAuth: true,
      loading: false,
      error: null,

      checkAuth: () => {
        const token = get().token;
        set({ isLoadingAuth: false, isAuthenticated: Boolean(token) });
      },

      setUser:    (user)  => set({ user }),
      setToken:   (token) => set({ token, isAuthenticated: true }),
      clearError: ()      => set({ error: null }),

      // ── Login ──────
      login: async ({ username, password }) => {
        try {
          set({ loading: true, error: null });

          const data = await loginRequest({ username, password });

          // El backend C# devuelve: { success, message, accessToken, refreshToken, userDetails }
          if (!data.success) {
            set({ error: data.message || 'Credenciales inválidas', loading: false });
            return { success: false, error: data.message };
          }

          set({
            user:            data.userDetails,
            token:           data.accessToken,
            refreshToken:    data.refreshToken,
            isAuthenticated: true,
            loading:         false,
          });

          return { success: true, user: data.userDetails };
        } catch (err) {
          const message =
            err.response?.data?.message ||
            err.response?.data?.title   ||
            'Error al conectar con el servidor';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // ── Register ─────
      register: async (formData) => {
        try {
          set({ loading: true, error: null });
          const data = await registerRequest(formData);

          if (!data.success) {
            set({ error: data.message || 'Error al registrar', loading: false });
            return { success: false, error: data.message };
          }

          set({ loading: false });
          return { success: true, message: data.message };
        } catch (err) {
          const message =
            err.response?.data?.message ||
            err.response?.data?.title   ||
            'Error al conectar con el servidor';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // ── Logout ─────
      logout: () => {
        set({
          user:            null,
          token:           null,
          refreshToken:    null,
          isAuthenticated: false,
          isLoadingAuth:   false,
          loading:         false,
          error:           null,
        });
      },
    }),

    {
      name: 'auth-storage-parroquial',
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);