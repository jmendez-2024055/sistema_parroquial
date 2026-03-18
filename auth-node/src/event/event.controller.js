import * as eventoService from './event.service.js';
import Category from '../category/category.model.js';

export const crear = async (req, res, next) => {
    try {
        const data = req.body;

        const categoria = await Category.findById(data.idCategoria);
        if (!categoria) {
            return res.status(400).json({
                success: false,
                message: 'La categoría no existe'
            });
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
        const eventos = await eventoService.obtenerEventos();

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
        const evento = await eventoService.obtenerEventoPorId(req.params.id);

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
            const categoria = await Category.findById(data.idCategoria);
            if (!categoria) {
                return res.status(400).json({
                    success: false,
                    message: 'La categoría no existe'
                });
            }
        }

        const evento = await eventoService.actualizarEvento(req.params.id, data);

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
        const evento = await eventoService.eliminarEvento(req.params.id);

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