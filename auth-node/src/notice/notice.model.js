import { Schema, model } from 'mongoose';

const avisoSchema = new Schema(
    {
        parishId: {
            type: String,
            required: false,
            index: true
        },
        titulo: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
            maxlength: 150
        },
        contenido: {
            type: String,
            required: [true, 'El contenido es obligatorio'],
            trim: true,
            maxlength: 1000
        },
        fechaPublicacion: {
            type: Date,
            default: Date.now
        },
        estado: {
            type: String,
            enum: ['ACTIVO', 'INACTIVO'],
            default: 'ACTIVO'
        },
        usuario: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

avisoSchema.index({ estado: 1 });
avisoSchema.index({ fechaPublicacion: -1 });

export default model('Aviso', avisoSchema);