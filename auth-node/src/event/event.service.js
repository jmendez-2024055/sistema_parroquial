import Evento from './event.model.js';

export const crearEvento = async (data) => {
    try {
        const evento = await Evento.create(data);

        return await evento.populate('idCategoria');

    } catch (error) {
        throw new Error('Error al crear el evento');
    }
};

export const obtenerEventos = async (parroquiaId) => {
    try {
        // Solo devolver eventos si se proporciona parroquiaId
        if (!parroquiaId) {
            return [];
        }
        return await Evento.find({ parroquiaId }).populate('idCategoria');
    } catch (error) {
        throw new Error('Error al obtener eventos');
    }
};

export const obtenerEventoPorId = async (id, parroquiaId) => {
    try {
        if (!parroquiaId) {
            return null;
        }
        const evento = await Evento.findOne({ _id: id, parroquiaId }).populate('idCategoria');
        if (!evento) {
            return null;
        }
        return evento;
    } catch (error) {
        throw new Error('Error al buscar el evento');
    }
};

export const actualizarEvento = async (id, data, parroquiaId) => {
    try {
        if (!parroquiaId) {
            return null;
        }
        const updated = await Evento.findOneAndUpdate(
            { _id: id, parroquiaId },
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

export const eliminarEvento = async (id, parroquiaId) => {
    try {
        if (!parroquiaId) {
            return null;
        }
        const deleted = await Evento.findOneAndDelete({ _id: id, parroquiaId });
        return deleted; 
    } catch (error) {
        throw new Error('Error al eliminar el evento');
    }
};