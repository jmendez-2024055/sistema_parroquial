import massScheduleService from './massSchedule.service.js';

class MassScheduleController {

    async getAll(req, res, next) {
        try {
            const data = await massScheduleService.getAll();

            res.json({
                success: true,
                data
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const data = await massScheduleService.getById(req.params.id);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado'
                });
            }

            res.json({
                success: true,
                data
            });

        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const data = await massScheduleService.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Horario de misa creado correctamente',
                data
            });

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const data = await massScheduleService.update(req.params.id, req.body);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Horario actualizado correctamente',
                data
            });

        } catch (error) {
            next(error);
        }
    }

    
    async delete(req, res, next) {
        try {
            const data = await massScheduleService.delete(req.params.id);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Horario eliminado correctamente'
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new MassScheduleController();