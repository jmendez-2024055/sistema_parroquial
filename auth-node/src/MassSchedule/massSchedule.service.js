const MassSchedule = require('./massSchedule.model');

class MassScheduleService {

    async getAll() {
        return await MassSchedule.find().sort({ diaSemana: 1 });
    }

    async getById(id) {
        const record = await MassSchedule.findById(id);
        if (!record) {
            throw new Error('Mass schedule not found');
        }
        return record;
    }

    async create(data) {
        const newRecord = new MassSchedule(data);
        return await newRecord.save();
    }

    async update(id, data) {
        const updated = await MassSchedule.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!updated) {
            throw new Error('Mass schedule not found');
        }

        return updated;
    }

    async delete(id) {
        const deleted = await MassSchedule.findByIdAndDelete(id);

        if (!deleted) {
            throw new Error('Mass schedule not found');
        }

        return deleted;
    }
}

module.exports = new MassScheduleService();