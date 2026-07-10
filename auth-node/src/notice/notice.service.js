import Aviso from './notice.model.js';

export const crearAviso = async (data) => {
    return await Aviso.create(data);
};

export const listarAvisos = async (parishId) => {
    const query = parishId ? { parishId } : {};
    return await Aviso.find(query)
        .sort({ fechaPublicacion: -1 });
};

export const obtenerAvisoPorId = async (id) => {
    return await Aviso.findById(id);
};

export const editarAviso = async (id, data) => {
    return await Aviso.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
};

export const eliminarAviso = async (id) => {
    return await Aviso.findByIdAndDelete(id);
};