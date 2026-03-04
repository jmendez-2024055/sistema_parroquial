const Evento = require('../models/evento.model');

const crearEvento = async (data) => {
    return await Evento.create(data);
};

const obtenerEventos = async () => {
    return await Evento.find();
};

const obtenerEventoPorId = async (id) => {
    return await Evento.findById(id);
};

const actualizarEvento = async (id, data) => {
    return await Evento.findByIdAndUpdate(id, data, { new: true });
};

const eliminarEvento = async (id) => {
    return await Evento.findByIdAndDelete(id);
};

module.exports = {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    actualizarEvento,
    eliminarEvento
};