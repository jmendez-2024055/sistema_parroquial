import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema({
    parroquiaId: {
        type: String,
        required: [true, 'El ID de la parroquia es obligatorio'],
        trim: true
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

eventoSchema.index({ parroquiaId: 1 });
eventoSchema.index({ fecha: 1 });
eventoSchema.index({ isActive: 1 });

export default mongoose.model('Evento', eventoSchema);