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

export const getCategoriasRecord = async () => {
  try {
    return await Categoria.find({ isActive: true })
      .sort({ nombreCategoria: 1 });
  } catch (error) {
    throw new Error('Error al obtener categorías');
  }
};

export const getCategoriaByIdRecord = async (id) => {
  try {
    return await Categoria.findById(id);
  } catch (error) {
    throw new Error('Error al buscar la categoría');
  }
};

export const updateCategoriaRecord = async (id, data) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      id,
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

export const deleteCategoriaRecord = async (id) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return categoria; 
  } catch (error) {
    throw new Error('Error al eliminar la categoría');
  }
};