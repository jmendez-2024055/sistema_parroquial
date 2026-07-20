import massScheduleService from './massSchedule.service.js';

class MassScheduleController {

    async getAll(req, res, next) {
        try {
            const parroquiaId = req.user?.parroquiaId;
            const data = await massScheduleService.getAll(parroquiaId);

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
            const parroquiaId = req.user?.parroquiaId;
            const data = await massScheduleService.getById(req.params.id, parroquiaId);

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
                ...req.body
            };

            // Agregar parroquiaId del usuario autenticado
            if (req.user?.parroquiaId) {
                data.parroquiaId = req.user.parroquiaId;
            }

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
            const parroquiaId = req.user?.parroquiaId;
            const data = await massScheduleService.update(req.params.id, req.body, parroquiaId);

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
            const parroquiaId = req.user?.parroquiaId;
            const data = await massScheduleService.delete(req.params.id, parroquiaId);

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