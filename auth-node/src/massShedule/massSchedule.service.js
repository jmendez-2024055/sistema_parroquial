import massSchedule from './massSchedule.model.js';

class MassScheduleService {

    async getAll(parishId) {
        const query = parishId ? { parishId } : {};
        return await massSchedule.find(query).sort({ diaSemana: 1, hora: 1 });
    }

    async getById(id) {
        return await massSchedule.findById(id);
    }

    async create(data) {
        const newRecord = new massSchedule(data);
        return await newRecord.save();
    }

    async update(id, data) {
        return await massSchedule.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await massSchedule.findByIdAndDelete(id);
    }
}

export default new MassScheduleService();