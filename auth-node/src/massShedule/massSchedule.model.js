import mongoose from 'mongoose';

const massScheduleSchema = new mongoose.Schema({
    diaSemana: {
        type: String,
        required: [true, 'El día de la semana es obligatorio'],
        enum: [
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
            'Domingo'
        ],
        trim: true
    },
    hora: {
        type: String,
        required: [true, 'La hora es obligatoria'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)']
    },
    tipoMisa: {
        type: String,
        required: [true, 'El tipo de misa es obligatorio'],
        maxlength: [100, 'Máximo 100 caracteres'],
        trim: true
    },
    celebrante: {
        type: String,
        required: [true, 'El celebrante es obligatorio'],
        maxlength: [150, 'Máximo 150 caracteres'],
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

massScheduleSchema.index({ diaSemana: 1 });
massScheduleSchema.index({ tipoMisa: 1 });

export default mongoose.model('MassSchedule', massScheduleSchema);