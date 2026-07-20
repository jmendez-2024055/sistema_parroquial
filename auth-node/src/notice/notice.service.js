import Aviso from './notice.model.js';

export const crearAviso = async (data) => {
    return await Aviso.create(data);
};

export const listarAvisos = async (parroquiaId) => {
    // Solo devolver avisos si se proporciona parroquiaId
    if (!parroquiaId) {
        return [];
    }
    return await Aviso.find({ parroquiaId })
        .sort({ fechaPublicacion: -1 });
};

export const obtenerAvisoPorId = async (id, parroquiaId) => {
    if (!parroquiaId) {
        return null;
    }
    const aviso = await Aviso.findOne({ _id: id, parroquiaId });
    if (!aviso) {
        return null;
    }
    return aviso;
};

export const editarAviso = async (id, data, parroquiaId) => {
    if (!parroquiaId) {
        return null;
    }
    return await Aviso.findOneAndUpdate(
        { _id: id, parroquiaId },
        data,
        { new: true, runValidators: true }
    );
};

export const eliminarAviso = async (id, parroquiaId) => {
    if (!parroquiaId) {
        return null;
    }
    return await Aviso.findOneAndDelete({ _id: id, parroquiaId });
};