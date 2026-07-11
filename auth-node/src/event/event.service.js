import Evento from './event.model.js';

export const crearEvento = async (data) => {
    try {
        const evento = await Evento.create(data);

        return await evento.populate('idCategoria');

    } catch (error) {
        throw new Error('Error al crear el evento');
    }
};

export const obtenerEventos = async (parishId) => {
    try {
        const query = parishId ? { parishId } : {};
        return await Evento.find(query).populate('idCategoria');
    } catch (error) {
        throw new Error('Error al obtener eventos');
    }
};

export const obtenerEventoPorId = async (id, parishId) => {
    try {
        const evento = await Evento.findById(id).populate('idCategoria');
        if (!evento || evento.parishId !== parishId) {
            return null;
        }
        return evento;
    } catch (error) {
        throw new Error('Error al buscar el evento');
    }
};

export const actualizarEvento = async (id, data, parishId) => {
    try {
        const evento = await Evento.findById(id);
        if (!evento || evento.parishId !== parishId) {
            return null;
        }
        // Prevent parishId from being overwritten
        delete data.parishId;
        const updated = await Evento.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        ).populate('idCategoria');

        return updated; 
    } catch (error) {
        throw new Error('Error al actualizar el evento');
    }
};

export const eliminarEvento = async (id, parishId) => {
    try {
        const evento = await Evento.findById(id);
        if (!evento) {
            return null;
        }
        const deleted = await Evento.findByIdAndDelete(id);
        return deleted; 
    } catch (error) {
        throw new Error('Error al eliminar el evento');
    }
};