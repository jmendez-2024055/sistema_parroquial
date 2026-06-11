import { create } from 'zustand';
import * as categoryService from '../service/categoryService.js';
import * as eventService from '../../event/services/eventService.js';

const useCategoryStore = create((set) => ({
    categorias: [],
    eventos: [],
    loading: false,
    error: null,

    fetchCategoriasConEventos: async () => {
        set({ loading: true, error: null });
        try {
            const [catRes, evtRes] = await Promise.all([
                categoryService.getCategorias(),
                eventService.getEventos(),
            ]);

            set({
                categorias: catRes.data.data,
                eventos: evtRes.data.data,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al cargar datos',
                loading: false,
            });
        }
    },
}));

export default useCategoryStore;
