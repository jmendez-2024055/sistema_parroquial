import Categoria from './category.model.js';

export const createCategoriaRecord = async (data) => {
  try {
    const categoria = new Categoria(data);
    await categoria.save();
    return categoria;
  } catch (error) {
    throw new Error('Error al crear la categoría');
  }
};

export const getCategoriasRecord = async (parroquiaId) => {
  try {
    // Solo devolver categorías si se proporciona parroquiaId
    if (!parroquiaId) {
      return [];
    }
    return await Categoria.find({ isActive: true, parroquiaId })
      .sort({ nombreCategoria: 1 });
  } catch (error) {
    throw new Error('Error al obtener categorías');
  }
};

export const getCategoriaByIdRecord = async (id, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    return await Categoria.findOne({ _id: id, parroquiaId });
  } catch (error) {
    throw new Error('Error al buscar la categoría');
  }
};

export const updateCategoriaRecord = async (id, data, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    const categoria = await Categoria.findOneAndUpdate(
      { _id: id, parroquiaId },
      data,
      {
        new: true,
        runValidators: true
      }
    );

    return categoria;
  } catch (error) {
    throw new Error('Error al actualizar la categoría');
  }
};

export const deleteCategoriaRecord = async (id, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    const categoria = await Categoria.findOneAndUpdate(
      { _id: id, parroquiaId },
      { isActive: false },
      { new: true }
    );

    return categoria;
  } catch (error) {
    throw new Error('Error al eliminar la categoría');
  }
};