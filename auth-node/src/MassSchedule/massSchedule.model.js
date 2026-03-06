const mongoose = require('mongoose');

const massScheduleSchema = new mongoose.Schema({
    diaSemana: {
        type: String,
        required: true,
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
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
    },
    tipoMisa: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    celebrante: {
        type: String,
        required: true,
        maxlength: 150,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MassSchedule', massScheduleSchema);