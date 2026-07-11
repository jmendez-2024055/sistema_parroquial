import Intencion from './intencion.model.js';
import massSchedule from '../massShedule/massSchedule.model.js';

export const crearIntencion = async (data) => {
    try {
        const horarioMisa = await massSchedule.findById(data.massScheduleId);
        if (!horarioMisa) throw new Error('El horario de misa especificado no existe');

        const hParishId = horarioMisa.parishId ? horarioMisa.parishId.toString() : null;
        const dParishId = data.parishId ? data.parishId.toString() : null;

        if (!horarioMisa.parishId) {
            await massSchedule.findByIdAndUpdate(data.massScheduleId, { parishId: data.parishId });
        } else if (hParishId !== dParishId) {
            throw new Error('El horario de misa no pertenece a esta parroquia.');
        }

        const dataToCreate = { ...data };
        if (!dataToCreate.fechaMisa) delete dataToCreate.fechaMisa;

        const intencion = await Intencion.create(dataToCreate);
        return await intencion.populate('massScheduleId');
    } catch (error) {
        console.error('Error en crearIntencion:', error.message);
        throw error;
    }
};

export const actualizarIntencion = async (id, data, parishId, skipParishCheck = false) => {
    try {
        const intencion = await Intencion.findById(id);
        if (!intencion) return null;

        const intencionParishId = intencion.parishId ? intencion.parishId.toString() : null;
        const userParishId = parishId ? parishId.toString() : null;

        if (!skipParishCheck && intencionParishId !== userParishId) return null;

        // CORRECCIÓN: Preparamos los datos limpios
        const updateData = { ...data };
        delete updateData.parishId;
        delete updateData._id;

        // SOLUCIÓN: Usamos { $set: updateData }
        // Esto permite actualizar solo los campos enviados (ej: estado)
        // sin que Mongoose valide la integridad de todo el objeto.
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

export const eliminarIntencion = async (id, parishId, skipParishCheck = false) => {
    try {
        const intencion = await Intencion.findById(id);
        if (!intencion) return null;

        const intencionParishId = intencion.parishId ? intencion.parishId.toString() : null;
        const userParishId = parishId ? parishId.toString() : null;

        if (!skipParishCheck && intencionParishId !== userParishId) return null;

        return await Intencion.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error en eliminarIntencion:', error.message);
        throw error;
    }
};

export const obtenerIntenciones = async (parishId, getAll = false) => {
    try {
        const query = getAll ? {} : { parishId };
        return await Intencion.find(query).populate('massScheduleId').sort({ fechaMisa: 1 });
    } catch (error) {
        throw new Error('Error al obtener las intenciones');
    }
};

export const obtenerIntencionPorId = async (id, parishId) => {
    try {
        const intencion = await Intencion.findById(id).populate('massScheduleId');
        if (!intencion) return null;
        
        if (intencion.parishId.toString() !== parishId.toString()) return null;
        
        return intencion;
    } catch (error) {
        throw new Error('Error al buscar la intención');
    }
};