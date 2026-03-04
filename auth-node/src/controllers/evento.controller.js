const eventoService = require('../services/evento.service');

const crear = async (req, res) => {
    try {
        const evento = await eventoService.crearEvento(req.body);
        res.status(201).json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const eventos = await eventoService.obtenerEventos();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const evento = await eventoService.obtenerEventoPorId(req.params.id);
        if (!evento) return res.status(404).json({ message: "No encontrado" });
        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const evento = await eventoService.actualizarEvento(req.params.id, req.body);
        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        await eventoService.eliminarEvento(req.params.id);
        res.json({ message: "Evento eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar
};