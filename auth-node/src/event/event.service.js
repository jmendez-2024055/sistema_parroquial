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

export const obtenerEventoPorId = async (id) => {
    try {
        return await Evento.findById(id).populate('idCategoria');
    } catch (error) {
        throw new Error('Error al buscar el evento');
    }
};

export const actualizarEvento = async (id, data) => {
    try {
        const evento = await Evento.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        ).populate('idCategoria');

        return evento; 
    } catch (error) {
        throw new Error('Error al actualizar el evento');
    }
};

export const eliminarEvento = async (id) => {
    try {
        const evento = await Evento.findByIdAndDelete(id);
        return evento; 
    } catch (error) {
        throw new Error('Error al eliminar el evento');
    }
};