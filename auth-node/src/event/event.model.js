import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema({
    parishId: {
        type: String,
        required: false,
        index: true
    },
    titulo: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 150
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: 500
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)']
    },
    lugar: {
        type: String,
        trim: true,
        maxlength: 200
    },
    idCategoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Evento', eventoSchema);