import Evento from './event.model.js';

export const crearEvento = async (data) => {
    return await Evento.create(data);
};

export const obtenerEventos = async () => {
    return await Evento.find();
};

export const obtenerEventoPorId = async (id) => {
    return await Evento.findById(id);
};

export const actualizarEvento = async (id, data) => {
    return await Evento.findByIdAndUpdate(id, data, { new: true });
};

export const eliminarEvento = async (id) => {
    return await Evento.findByIdAndDelete(id);
};