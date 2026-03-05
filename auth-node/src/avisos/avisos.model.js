import { Schema, model } from 'mongoose';

const avisoSchema = new Schema(
    {
        titulo: {
            type: String,
            required: [true, 'El título del aviso es obligatorio'],
            trim: true,
            maxlength: [150, 'El título no puede superar los 150 caracteres'],
        },
        contenido: {
            type: String,
            required: [true, 'El contenido del aviso es obligatorio'],
            trim: true,
            maxlength: [1000, 'El contenido no puede superar los 1000 caracteres'],
        },
        fechaPublicacion: {
            type: Date,
            required: [true, 'La fecha de publicación es obligatoria'],
            default: Date.now,
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: [true, 'El ID del usuario es obligatorio'],
        },
        estado: {
            type: String,
            enum: {
                values: ['ACTIVO', 'INACTIVO'],
                message: 'Estado inválido',
            },
            default: 'ACTIVO',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Aviso = model('Aviso', avisoSchema);