import Aviso from './notice.model.js';

export const crearAviso = async (data) => {
    return await Aviso.create(data);
};

export const listarAvisos = async () => {
    return await Aviso.find({})
        .sort({ fechaPublicacion: -1 });
};

export const obtenerAvisoPorId = async (id) => {
    const aviso = await Aviso.findById(id);
    if (!aviso) {
        return null;
    }
    return aviso;
};

export const editarAviso = async (id, data) => {
    const aviso = await Aviso.findById(id);
    if (!aviso) {
        return null;
    }
    return await Aviso.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
};

export const eliminarAviso = async (id) => {
    const aviso = await Aviso.findById(id);
    if (!aviso) {
        return null;
    }
    return await Aviso.findByIdAndDelete(id);
};