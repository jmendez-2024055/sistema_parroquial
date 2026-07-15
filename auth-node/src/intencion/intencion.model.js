import mongoose from 'mongoose';

const intencionSchema = new mongoose.Schema({
    massScheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MassSchedule',
        required: true
    },
    fechaMisa: {
        type: Date,
        required: false
    },
    nombreSolicitante: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxlength: 150,
        trim: true
    },
    intencion: {
        type: String,
        required: [true, 'La intención es obligatoria'],
        maxlength: 500,
        trim: true
    },
    userId: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'CONFIRMADA', 'LEIDA'],
        default: 'PENDIENTE'
    }
}, {
    timestamps: true,
    versionKey: false
});

intencionSchema.index({ massScheduleId: 1, fechaMisa: 1 });
intencionSchema.index({ estado: 1 });

export default mongoose.model('Intencion', intencionSchema);
