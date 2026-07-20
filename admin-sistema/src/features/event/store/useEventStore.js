import { create } from 'zustand';
import * as eventService from "../services/eventService.js";
import * as categoryService from "../../category/service/categoryService.js";

const useEventStore = create((set, get) => ({
    eventos: [],
    categorias: [],
    loading: false,
    error: null,

    fetchEventos: async () => {
        set({ loading: true, error: null });
        try {
            const res = await eventService.getEventos();
            set({ eventos: res.data.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Error al obtener eventos', loading: false });
        }
    },

    fetchCategorias: async () => {
        try {
            const res = await eventService.getCategorias();
            const categorias = res.data.data || [];
            
            // Si no hay categorías, inicializarlas y volver a obtener
            if (categorias.length === 0) {
                await categoryService.initializeCategorias();
                const retryRes = await eventService.getCategorias();
                set({ categorias: retryRes.data.data });
            } else {
                set({ categorias });
            }
        } catch (err) {
            set({ error: 'Error al obtener categorías' });
        }
    },

    createEvento: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await eventService.createEvento(data);
            set((state) => ({
                eventos: [...state.eventos, res.data.data],
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            set({ error: err.response?.data?.message || 'Error al crear evento', loading: false });
            return { success: false };
        }
    },

    updateEvento: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await eventService.updateEvento(id, data);
            set((state) => ({
                eventos: state.eventos.map((e) => e._id === id ? res.data.data : e),
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            set({ error: err.response?.data?.message || 'Error al actualizar evento', loading: false });
            return { success: false };
        }
    },

    deleteEvento: async (id) => {
        try {
            await eventService.deleteEvento(id);
            set((state) => ({
                eventos: state.eventos.filter((e) => e._id !== id),
            }));
        } catch (err) {
            set({ error: 'Error al eliminar evento' });
        }
    },
}));

export default useEventStore;
