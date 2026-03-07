import { Schema, model } from 'mongoose';

const categoriaSchema = new Schema(
  {
    idCategoria: {
      type: Number,
      required: [true, 'El ID de la categoría es obligatorio'],
      unique: true,
    },
    nombreCategoria: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      trim: true,
      enum: {
        values: ['Litúrgico', 'Formativo', 'Juvenil', 'Comunitario'],
        message: 'El nombre de categoría no es válido',
      },
      maxLength: [100, 'El nombre no puede exceder los 100 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxLength: [255, 'La descripción no puede exceder los 255 caracteres'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

categoriaSchema.index({ isActive: 1 });
categoriaSchema.index({ nombreCategoria: 1 });
categoriaSchema.index({ isActive: 1, nombreCategoria: 1 });

export default model('Categoria', categoriaSchema);