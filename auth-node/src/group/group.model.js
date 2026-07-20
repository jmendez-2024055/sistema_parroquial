import { Schema, model } from 'mongoose';

const groupSchema = new Schema(
  {
    parroquiaId: {
      type: String,
      required: [true, 'El ID de la parroquia es obligatorio'],
      trim: true,
    },
    nombreGrupo: {
      type: String,
      required: [true, 'El nombre del grupo es obligatorio'],
      trim: true,
      maxLength: [100, 'El nombre no puede exceder los 100 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxLength: [500, 'La descripción no puede exceder los 500 caracteres'],
    },
    requisitos: {
      type: String,
      trim: true,
      maxLength: [500, 'Los requisitos no pueden exceder los 500 caracteres'],
    },
    cupoMaximo: {
      type: Number,
      default: null,
      min: [1, 'El cupo máximo debe ser al menos 1'],
    },
    cupoActual: {
      type: Number,
      default: 0,
      min: [0, 'El cupo actual no puede ser negativo'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
groupSchema.index({ parroquiaId: 1 });
groupSchema.index({ isActive: 1 });
groupSchema.index({ nombreGrupo: 1 });

export default model('Group', groupSchema);
