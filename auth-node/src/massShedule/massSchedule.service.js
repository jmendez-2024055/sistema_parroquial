import massSchedule from './massSchedule.model.js';

class MassScheduleService {

    async getAll(parroquiaId) {
        // Solo devolver horarios si se proporciona parroquiaId
        if (!parroquiaId) {
            return [];
        }
        return await massSchedule.find({ parroquiaId }).sort({ diaSemana: 1, hora: 1 });
    }

    async getById(id, parroquiaId) {
        if (!parroquiaId) {
            return null;
        }
        const record = await massSchedule.findOne({ _id: id, parroquiaId });
        if (!record) {
            return null;
        }
        return record;
    }

    async create(data) {
        const newRecord = new massSchedule(data);
        return await newRecord.save();
    }

    async update(id, data, parroquiaId) {
        if (!parroquiaId) {
            return null;
        }
        return await massSchedule.findOneAndUpdate(
            { _id: id, parroquiaId },
            data,
            { new: true, runValidators: true }
        );
    }

    async delete(id, parroquiaId) {
        if (!parroquiaId) {
            return null;
        }
        return await massSchedule.findOneAndDelete({ _id: id, parroquiaId });
    }
}

export default new MassScheduleService();