const massScheduleService = require('./massSchedule.service');

class MassScheduleController {

    async getAll(req, res) {
        try {
            const data = await massScheduleService.getAll();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const data = await massScheduleService.getById(req.params.id);
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const data = await massScheduleService.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const data = await massScheduleService.update(
                req.params.id,
                req.body
            );
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await massScheduleService.delete(req.params.id);
            res.status(200).json({ message: 'Mass schedule deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new MassScheduleController();