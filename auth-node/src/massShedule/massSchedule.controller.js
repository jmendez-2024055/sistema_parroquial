import massScheduleService from './massSchedule.service.js';

class MassScheduleController {

    async getAll(req, res, next) {
        try {
            const parishId = req.user?.parishId || null;
            const data = await massScheduleService.getAll(parishId);

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
            const parishId = req.user.parishId;
            const data = await massScheduleService.getById(req.params.id, parishId);

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
            const data = {
                ...req.body,
                parishId: req.user.parishId
            };
            const result = await massScheduleService.create(data);

            res.status(201).json({
                success: true,
                message: 'Horario de misa creado correctamente',
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const parishId = req.user.parishId;
            const data = await massScheduleService.update(req.params.id, req.body, parishId);

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
            const parishId = req.user.parishId;
            const data = await massScheduleService.delete(req.params.id, parishId);

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