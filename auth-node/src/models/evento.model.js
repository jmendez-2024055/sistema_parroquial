const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        maxlength: 150
    },
    descripcion: {
        type: String,
        maxlength: 500
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String, // Mongo no tiene tipo TIME
        required: true
    },
    lugar: {
        type: String,
        maxlength: 200
    },
    idCategoria: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Evento', eventoSchema);