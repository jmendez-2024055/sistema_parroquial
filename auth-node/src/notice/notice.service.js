import Aviso from './notice.model.js';

export const crearAviso = async (data) => {
    return await Aviso.create(data);
};

export const listarAvisos = async (parishId) => {
    const query = parishId ? { parishId } : {};
    return await Aviso.find(query)
        .sort({ fechaPublicacion: -1 });
};

export const obtenerAvisoPorId = async (id, parishId) => {
    const aviso = await Aviso.findById(id);
    if (!aviso || aviso.parishId !== parishId) {
        return null;
    }
    return aviso;
};

export const editarAviso = async (id, data, parishId) => {
    const aviso = await Aviso.findById(id);
    if (!aviso || aviso.parishId !== parishId) {
        return null;
    }
    // Prevent parishId from being overwritten
    delete data.parishId;
    return await Aviso.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
};

export const eliminarAviso = async (id, parishId) => {
    const aviso = await Aviso.findById(id);
    if (!aviso) {
        return null;
    }
    return await Aviso.findByIdAndDelete(id);
};