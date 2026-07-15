import Intencion from './intencion.model.js';
import massSchedule from '../massShedule/massSchedule.model.js';

export const crearIntencion = async (data) => {
    try {
        const horarioMisa = await massSchedule.findById(data.massScheduleId);
        if (!horarioMisa) throw new Error('El horario de misa especificado no existe');

        const dataToCreate = { ...data };
        if (!dataToCreate.fechaMisa) delete dataToCreate.fechaMisa;

        const intencion = await Intencion.create(dataToCreate);
        return await intencion.populate('massScheduleId');
    } catch (error) {
        console.error('Error en crearIntencion:', error.message);
        throw error;
    }
};

export const actualizarIntencion = async (id, data) => {
    try {
        const intencion = await Intencion.findById(id);
        if (!intencion) return null;

        const updateData = { ...data };
        delete updateData._id;

        const actualizada = await Intencion.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true, context: 'query' }
        ).populate('massScheduleId');

        return actualizada;
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error('Validación fallida en Mongoose:', error.errors);
        } else {
            console.error('Error en actualizarIntencion:', error);
        }
        throw error;
    }
};

export const eliminarIntencion = async (id) => {
    try {
        const intencion = await Intencion.findById(id);
        if (!intencion) return null;

        return await Intencion.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error en eliminarIntencion:', error.message);
        throw error;
    }
};

export const obtenerIntenciones = async (getAll = false) => {
    try {
        const query = getAll ? {} : {};
        return await Intencion.find(query).populate('massScheduleId').sort({ fechaMisa: 1 });
    } catch (error) {
        throw new Error('Error al obtener las intenciones');
    }
};

export const obtenerIntencionPorId = async (id) => {
    try {
        const intencion = await Intencion.findById(id).populate('massScheduleId');
        if (!intencion) return null;
        
        return intencion;
    } catch (error) {
        throw new Error('Error al buscar la intención');
    }
};