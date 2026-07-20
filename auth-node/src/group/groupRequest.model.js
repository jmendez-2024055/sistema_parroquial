import { Schema, model } from 'mongoose';

const groupRequestSchema = new Schema(
  {
    parroquiaId: {
      type: String,
      required: [true, 'El ID de la parroquia es obligatorio'],
      trim: true,
    },
    idGrupo: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'El grupo es obligatorio'],
    },
    idUsuario: {
      type: String,
      required: [true, 'El usuario es obligatorio'],
    },
    estado: {
      type: String,
      enum: ['pendiente', 'aprobada', 'rechazada'],
      default: 'pendiente',
    },
    mensaje: {
      type: String,
      trim: true,
      maxLength: [500, 'El mensaje no puede exceder los 500 caracteres'],
    },
    respuestaAdmin: {
      type: String,
      trim: true,
      maxLength: [500, 'La respuesta no puede exceder los 500 caracteres'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
groupRequestSchema.index({ idGrupo: 1, idUsuario: 1 }, { unique: true });
groupRequestSchema.index({ estado: 1 });
groupRequestSchema.index({ idUsuario: 1 });

export default model('GroupRequest', groupRequestSchema);
