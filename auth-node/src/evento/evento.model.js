import mongoose from 'mongoose';

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
        type: String,
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

export default mongoose.model('Evento', eventoSchema);