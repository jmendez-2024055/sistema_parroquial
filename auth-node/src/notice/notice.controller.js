import * as avisosService from "./notice.service.js";

export const crearAviso = async (req, res) => {
    try {
        const aviso = await avisosService.crearAviso(req.body);
        res.status(201).json(aviso);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const listarAvisos = async (req, res) => {
    try {
        const avisos = await avisosService.listarAvisos();
        res.json(avisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const editarAviso = async (req, res) => {
    try {
        const aviso = await avisosService.editarAviso(req.params.id, req.body);
        res.json(aviso);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


export const eliminarAviso = async (req, res) => {
    try {
        await avisosService.eliminarAviso(req.params.id);
        res.json({ message: "Aviso eliminado correctamente" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};