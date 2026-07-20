import * as eventoService from './event.service.js';
import Category from '../category/category.model.js';

export const crear = async (req, res, next) => {
    try {
        const data = {
            ...req.body
        };

        // Agregar parroquiaId del usuario autenticado
        if (req.user?.parroquiaId) {
            data.parroquiaId = req.user.parroquiaId;
        }

        if (data.idCategoria) {
            const categoria = await Category.findOne({ _id: data.idCategoria, parroquiaId: data.parroquiaId });
            if (!categoria) {
                return res.status(400).json({
                    success: false,
                    message: 'La categoría no existe'
                });
            }
        }

        const evento = await eventoService.crearEvento(data);

        res.status(201).json({
            success: true,
            message: 'Evento creado correctamente',
            data: evento
        });

    } catch (error) {
        next(error);
    }
};

export const listar = async (req, res, next) => {
    try {
        const parroquiaId = req.user?.parroquiaId;
        const eventos = await eventoService.obtenerEventos(parroquiaId);

        res.json({
            success: true,
            data: eventos
        });

    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const parroquiaId = req.user?.parroquiaId;
        const evento = await eventoService.obtenerEventoPorId(req.params.id, parroquiaId);

        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        res.json({
            success: true,
            data: evento
        });

    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const data = req.body;

        if (data.idCategoria) {
            const parroquiaId = req.user?.parroquiaId;
            const categoria = await Category.findOne({ _id: data.idCategoria, parroquiaId });
            if (!categoria) {
                return res.status(400).json({
                    success: false,
                    message: 'La categoría no existe'
                });
            }
        }

        const parroquiaId = req.user?.parroquiaId;
        const evento = await eventoService.actualizarEvento(req.params.id, data, parroquiaId);

        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Evento actualizado correctamente',
            data: evento
        });

    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
        const parroquiaId = req.user?.parroquiaId;
        const evento = await eventoService.eliminarEvento(req.params.id, parroquiaId);

        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Evento eliminado correctamente'
        });

    } catch (error) {
        next(error);
    }
};