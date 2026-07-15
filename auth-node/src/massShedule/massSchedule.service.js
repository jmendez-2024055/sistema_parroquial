import massSchedule from './massSchedule.model.js';

class MassScheduleService {

    async getAll() {
        return await massSchedule.find({}).sort({ diaSemana: 1, hora: 1 });
    }

    async getById(id) {
        const record = await massSchedule.findById(id);
        if (!record) {
            return null;
        }
        return record;
    }

    async create(data) {
        const newRecord = new massSchedule(data);
        return await newRecord.save();
    }

    async update(id, data) {
        const record = await massSchedule.findById(id);
        if (!record) {
            return null;
        }
        return await massSchedule.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        const record = await massSchedule.findById(id);
        if (!record) {
            return null;
        }
        return await massSchedule.findByIdAndDelete(id);
    }
}

export default new MassScheduleService();