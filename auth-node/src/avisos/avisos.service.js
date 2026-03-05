import { Aviso } from "./avisos.model.js";

export const crearAviso = async (data) => {
    const aviso = new Aviso(data);
    return await aviso.save();
};

export const listarAvisos = async () => {
    return await Aviso.find({ estado: 'ACTIVO' });
};

export const editarAviso = async (id, data) => {
    const aviso = await Aviso.findById(id);
    if (!aviso || aviso.estado === 'INACTIVO') throw new Error("Aviso no encontrado");
    Object.assign(aviso, data);
    return await aviso.save();
};

export const eliminarAviso = async (id) => {
    const aviso = await Aviso.findById(id);
    if (!aviso) throw new Error("Aviso no encontrado");
    aviso.estado = 'INACTIVO';
    return await aviso.save();
};