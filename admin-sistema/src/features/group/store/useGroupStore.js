import { create } from 'zustand';
import * as groupService from '../service/groupService.js';
import * as groupRequestService from '../service/groupRequestService.js';

const useGroupStore = create((set) => ({
    groups: [],
    groupRequests: [],
    myRequests: [],
    loading: false,
    error: null,

    // Grupos
    fetchGroups: async () => {
        set({ loading: true, error: null });
        try {
            const res = await groupService.getGroups();
            set({
                groups: res.data.data,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al cargar grupos',
                loading: false,
            });
        }
    },

    createGroup: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await groupService.createGroup(data);
            set((state) => ({
                groups: [...state.groups, res.data.data],
                loading: false,
            }));
            return res.data.data;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al crear grupo',
                loading: false,
            });
            throw err;
        }
    },

    updateGroup: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await groupService.updateGroup(id, data);
            set((state) => ({
                groups: state.groups.map((g) => (g._id === id ? res.data.data : g)),
                loading: false,
            }));
            return res.data.data;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al actualizar grupo',
                loading: false,
            });
            throw err;
        }
    },

    deleteGroup: async (id) => {
        set({ loading: true, error: null });
        try {
            await groupService.deleteGroup(id);
            set((state) => ({
                groups: state.groups.filter((g) => g._id !== id),
                loading: false,
            }));
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al eliminar grupo',
                loading: false,
            });
            throw err;
        }
    },

    // Solicitudes (Admin)
    fetchGroupRequests: async (estado = null) => {
        set({ loading: true, error: null });
        try {
            const res = await groupRequestService.getGroupRequests(estado);
            set({
                groupRequests: res.data.data,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al cargar solicitudes',
                loading: false,
            });
        }
    },

    approveRequest: async (id, respuestaAdmin = '') => {
        set({ loading: true, error: null });
        try {
            const res = await groupRequestService.approveGroupRequest(id, respuestaAdmin);
            set((state) => ({
                groupRequests: state.groupRequests.map((r) => 
                    r._id === id ? res.data.data : r
                ),
                loading: false,
            }));
            return res.data.data;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al aprobar solicitud',
                loading: false,
            });
            throw err;
        }
    },

    rejectRequest: async (id, respuestaAdmin = '') => {
        set({ loading: true, error: null });
        try {
            const res = await groupRequestService.rejectGroupRequest(id, respuestaAdmin);
            set((state) => ({
                groupRequests: state.groupRequests.map((r) => 
                    r._id === id ? res.data.data : r
                ),
                loading: false,
            }));
            return res.data.data;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al rechazar solicitud',
                loading: false,
            });
            throw err;
        }
    },

    // Solicitudes del usuario actual
    fetchMyRequests: async () => {
        set({ loading: true, error: null });
        try {
            const res = await groupRequestService.getMyGroupRequests();
            set({
                myRequests: res.data.data,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al cargar mis solicitudes',
                loading: false,
            });
        }
    },

    createRequest: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await groupRequestService.createGroupRequest(data);
            set((state) => ({
                myRequests: [...state.myRequests, res.data.data],
                loading: false,
            }));
            return res.data.data;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al crear solicitud',
                loading: false,
            });
            throw err;
        }
    },

    deleteRequest: async (id) => {
        set({ loading: true, error: null });
        try {
            await groupRequestService.deleteGroupRequest(id);
            set((state) => ({
                myRequests: state.myRequests.filter((r) => r._id !== id),
                groupRequests: state.groupRequests.filter((r) => r._id !== id),
                loading: false,
            }));
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al eliminar solicitud',
                loading: false,
            });
            throw err;
        }
    },
}));

export default useGroupStore;
