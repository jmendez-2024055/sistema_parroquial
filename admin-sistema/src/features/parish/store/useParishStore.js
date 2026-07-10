import { create } from 'zustand';
import { parishService } from '../../../shared/services/parishService';

const useParishStore = create((set, get) => ({
  currentParish: null,
  parishes: [],
  loading: false,
  error: null,

  setCurrentParish: (parish) => set({ currentParish: parish }),

  loadParishById: async (parishId) => {
    set({ loading: true, error: null });
    try {
      const response = await parishService.getParishById(parishId);
      if (response.success) {
        set({ currentParish: response.data, loading: false });
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  loadAllParishes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await parishService.getAllParishes();
      if (response.success) {
        set({ parishes: response.data, loading: false });
        return response.data;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearParish: () => set({ currentParish: null }),
}));

export default useParishStore;
