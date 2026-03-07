import * as eventoService from './event.service.js';

export const crear = async (req, res) => {
    try {
        const evento = await eventoService.crearEvento(req.body);
        res.status(201).json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const listar = async (req, res) => {
    try {
        const eventos = await eventoService.obtenerEventos();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const evento = await eventoService.obtenerEventoPorId(req.params.id);
        if (!evento) return res.status(404).json({ message: "No encontrado" });
        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const actualizar = async (req, res) => {
    try {
        const evento = await eventoService.actualizarEvento(req.params.id, req.body);
        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const eliminar = async (req, res) => {
    try {
        await eventoService.eliminarEvento(req.params.id);
        res.json({ message: "Evento eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};