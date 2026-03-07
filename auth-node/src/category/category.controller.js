import { createCategoriaRecord } from './category.service.js';
import { getCategoriasRecord } from './category.service.js';

export const createCategoria = async (req, res) => {
  try {
    const categoria = await createCategoriaRecord({
      categoriaData: req.body,
    });
    res.status(201).json({
      success: true,
      message: 'Categoría registrada correctamente',
      data: categoria,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar la categoría',
      error: err.message,
    });
  }
};

export const getCategorias = async (req, res) => {
  try {
    const categorias = await getCategoriasRecord();
    res.status(200).json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      total: categorias.length,
      data: categorias,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: err.message,
    });
  }
};