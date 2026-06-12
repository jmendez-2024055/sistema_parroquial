import { create } from 'zustand';
import * as massScheduleService from "../services/massScheduleService.js";

const useMassScheduleStore = create((set, get) => ({
    massSchedules: [],
    loading: false,
    error: null,

    fetchMassSchedules: async () => {
        set({ loading: true, error: null });
        try {
            const res = await massScheduleService.getMassSchedules();
            set({ massSchedules: res.data.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Error al obtener horarios de misa', loading: false });
        }
    },

    createMassSchedule: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await massScheduleService.createMassSchedule(data);
            set((state) => ({
                massSchedules: [...state.massSchedules, res.data.data],
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            set({ error: err.response?.data?.message || 'Error al crear horario de misa', loading: false });
            return { success: false };
        }
    },

    updateMassSchedule: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await massScheduleService.updateMassSchedule(id, data);
            set((state) => ({
                massSchedules: state.massSchedules.map((schedule) =>
                    schedule._id === id ? res.data.data : schedule
                ),
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            set({ error: err.response?.data?.message || 'Error al actualizar horario de misa', loading: false });
            return { success: false };
        }
    },

    deleteMassSchedule: async (id) => {
        try {
            await massScheduleService.deleteMassSchedule(id);
            set((state) => ({
                massSchedules: state.massSchedules.filter((s) => s._id !== id),
            }));
        } catch (err) {
            set({ error: 'Error al eliminar horario de misa' });
        }
    },
}));

export default useMassScheduleStore;
