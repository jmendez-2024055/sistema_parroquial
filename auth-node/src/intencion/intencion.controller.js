import * as intencionService from './intencion.service.js';

export const crear = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            userId: req.user.id
        };

        // Agregar parroquiaId del usuario autenticado
        if (req.user?.parroquiaId) {
            data.parroquiaId = req.user.parroquiaId;
        }

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
        const parroquiaId = req.user?.parroquiaId;
        const role = req.user.role;

        const intenciones = await intencionService.obtenerIntenciones(parroquiaId, role === 'ADMIN_ROLE');

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
        const parroquiaId = req.user?.parroquiaId;
        const intencion = await intencionService.obtenerIntencionPorId(req.params.id, parroquiaId);

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
        const parroquiaId = req.user?.parroquiaId;
        const intencion = await intencionService.actualizarIntencion(req.params.id, req.body, parroquiaId);

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
        const parroquiaId = req.user?.parroquiaId;
        const intencion = await intencionService.eliminarIntencion(req.params.id, parroquiaId);

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
