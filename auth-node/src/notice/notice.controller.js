import * as avisosService from "./notice.service.js";

export const crearAviso = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            usuario: req.user.id // 🔥 viene del token
        };

        const aviso = await avisosService.crearAviso(data);

        res.status(201).json({
            success: true,
            message: "Aviso creado correctamente",
            data: aviso
        });

    } catch (error) {
        next(error);
    }
};

export const listarAvisos = async (req, res, next) => {
    try {
        const avisos = await avisosService.listarAvisos();

        res.json({
            success: true,
            total: avisos.length,
            data: avisos
        });

    } catch (error) {
        next(error);
    }
};

export const obtenerAvisoPorId = async (req, res, next) => {
    try {
        const aviso = await avisosService.obtenerAvisoPorId(req.params.id);

        if (!aviso) {
            return res.status(404).json({
                success: false,
                message: "Aviso no encontrado"
            });
        }

        res.json({
            success: true,
            data: aviso
        });

    } catch (error) {
        next(error);
    }
};

export const editarAviso = async (req, res, next) => {
    try {
        const aviso = await avisosService.obtenerAvisoPorId(req.params.id);

        if (!aviso) {
            return res.status(404).json({
                success: false,
                message: "Aviso no encontrado"
            });
        }

        if (aviso.usuario.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso"
            });
        }

        const actualizado = await avisosService.editarAviso(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: "Aviso actualizado correctamente",
            data: actualizado
        });

    } catch (error) {
        next(error);
    }
};

export const eliminarAviso = async (req, res, next) => {
    try {
        const aviso = await avisosService.obtenerAvisoPorId(req.params.id);

        if (!aviso) {
            return res.status(404).json({
                success: false,
                message: "Aviso no encontrado"
            });
        }

        if (aviso.usuario.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso"
            });
        }

        await avisosService.eliminarAviso(req.params.id);

        res.json({
            success: true,
            message: "Aviso eliminado correctamente"
        });

    } catch (error) {
        next(error);
    }
};