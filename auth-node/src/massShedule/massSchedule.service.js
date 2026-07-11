import massSchedule from './massSchedule.model.js';

class MassScheduleService {

    async getAll(parishId) {
        const query = parishId ? { parishId } : {};
        return await massSchedule.find(query).sort({ diaSemana: 1, hora: 1 });
    }

    async getById(id, parishId) {
        const record = await massSchedule.findById(id);
        if (!record || record.parishId !== parishId) {
            return null;
        }
        return record;
    }

    async create(data) {
        const newRecord = new massSchedule(data);
        return await newRecord.save();
    }

    async update(id, data, parishId) {
        const record = await massSchedule.findById(id);
        if (!record || record.parishId !== parishId) {
            return null;
        }
        // Prevent parishId from being overwritten
        delete data.parishId;
        return await massSchedule.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    async delete(id, parishId) {
        const record = await massSchedule.findById(id);
        if (!record) {
            return null;
        }
        return await massSchedule.findByIdAndDelete(id);
    }
}

export default new MassScheduleService();