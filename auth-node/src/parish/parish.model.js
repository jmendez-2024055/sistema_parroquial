import mongoose from 'mongoose';

const parishSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la parroquia es obligatorio'],
        trim: true,
        maxlength: [200, 'Máximo 200 caracteres']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        trim: true,
        maxlength: [500, 'Máximo 500 caracteres']
    },
    ubicacion: {
        latitud: {
            type: Number,
            required: [true, 'La latitud es obligatoria'],
            min: -90,
            max: 90
        },
        longitud: {
            type: Number,
            required: [true, 'La longitud es obligatoria'],
            min: -180,
            max: 180
        }
    },
    contacto: {
        telefono: {
            type: String,
            trim: true,
            maxlength: [20, 'Máximo 20 caracteres']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: [100, 'Máximo 100 caracteres']
        },
        paginaWeb: {
            type: String,
            trim: true,
            maxlength: [200, 'Máximo 200 caracteres']
        }
    },
    horarios: [{
        dia: {
            type: String,
            enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            required: true
        },
        horarios: [{
            hora: {
                type: String,
                required: true,
                match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)']
            },
            tipoMisa: {
                type: String,
                required: true,
                maxlength: [100, 'Máximo 100 caracteres']
            }
        }]
    }],
    imagen: {
        type: String,
        trim: true,
        maxlength: [500, 'Máximo 500 caracteres']
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [1000, 'Máximo 1000 caracteres']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isClaimed: {
        type: Boolean,
        default: true
    },
    osmId: {
        type: String,
        default: null,
        index: true,
        sparse: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'parishes'
});

// Índices geoespaciales para búsquedas de proximidad
parishSchema.index({ 'ubicacion.latitud': 1, 'ubicacion.longitud': 1 });
parishSchema.index({ isActive: 1 });
parishSchema.index({ nombre: 'text', direccion: 'text' });

export default mongoose.model('Parish', parishSchema);
