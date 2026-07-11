import * as intencionService from './intencion.service.js';

export const crear = async (req, res, next) => {
    try {
        if (!req.user.parishId || req.user.parishId === '') {
            return res.status(400).json({
                success: false,
                message: 'No tienes una parroquia asignada. Contacta al administrador.'
            });
        }

        const data = {
            ...req.body,
            parishId: req.user.parishId,
            userId: req.user.id
        };

        const intencion = await intencionService.crearIntencion(data);

        res.status(201).json({
            success: true,
            message: 'Intención creada correctamente',
            data: intencion
        });

    } catch (error) {
        next(error);
    }
};

export const listar = async (req, res, next) => {
    try {
        const parishId = req.user.parishId;
        const role = req.user.role;
        
        // Si es admin sin parishId, obtener todas las intenciones
        const intenciones = await intencionService.obtenerIntenciones(parishId, role === 'ADMIN_ROLE' && !parishId);

        res.json({
            success: true,
            total: intenciones.length,
            data: intenciones
        });

    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const parishId = req.user.parishId;
        const intencion = await intencionService.obtenerIntencionPorId(req.params.id, parishId);

        if (!intencion) {
            return res.status(404).json({
                success: false,
                message: 'Intención no encontrada'
            });
        }

        res.json({
            success: true,
            data: intencion
        });

    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const parishId = req.user.parishId;
        const role = req.user.role;
        const isAdminWithoutParish = role === 'ADMIN_ROLE' && !parishId;
        
        const intencion = await intencionService.actualizarIntencion(req.params.id, req.body, parishId, isAdminWithoutParish);

        if (!intencion) {
            return res.status(404).json({
                success: false,
                message: 'Intención no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Intención actualizada correctamente',
            data: intencion
        });

    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
        const parishId = req.user.parishId;
        const role = req.user.role;
        const isAdminWithoutParish = role === 'ADMIN_ROLE' && !parishId;
        
        const intencion = await intencionService.eliminarIntencion(req.params.id, parishId, isAdminWithoutParish);

        if (!intencion) {
            return res.status(404).json({
                success: false,
                message: 'Intención no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Intención eliminada correctamente'
        });

    } catch (error) {
        next(error);
    }
};
