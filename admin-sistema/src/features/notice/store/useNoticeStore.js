import { create } from 'zustand';
import * as noticeService from '../service/noticeService.js';

const useNoticeStore = create((set) => ({
    notices: [],
    loading: false,
    error: null,

    // Obtener todos los avisos
    fetchNotices: async () => {
        set({ loading: true, error: null });
        try {
            const res = await noticeService.getNotices();
            set({
                notices: res.data.data,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al cargar avisos',
                loading: false,
            });
        }
    },

    // Obtener aviso por ID
    getNoticeById: async (id) => {
        try {
            const res = await noticeService.getNoticeById(id);
            return res.data.data;
        } catch (err) {
            throw err.response?.data || err;
        }
    },

    // Crear nuevo aviso
    createNotice: async (data) => {
        try {
            const res = await noticeService.createNotice(data);
            set((state) => ({
                notices: [res.data.data, ...state.notices],
            }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Error al crear aviso',
            };
        }
    },

    // Actualizar aviso
    updateNotice: async (id, data) => {
        try {
            const res = await noticeService.updateNotice(id, data);
            set((state) => ({
                notices: state.notices.map((notice) =>
                    notice._id === id ? res.data.data : notice
                ),
            }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Error al actualizar aviso',
            };
        }
    },

    // Eliminar aviso
    deleteNotice: async (id) => {
        try {
            await noticeService.deleteNotice(id);
            set((state) => ({
                notices: state.notices.filter((notice) => notice._id !== id),
            }));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Error al eliminar aviso',
            };
        }
    },
}));

export default useNoticeStore;
