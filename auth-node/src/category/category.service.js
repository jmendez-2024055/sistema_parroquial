import Categoria from './category.model.js';

export const createCategoriaRecord = async ({ categoriaData }) => {
  const categoria = new Categoria(categoriaData);
  await categoria.save();
  return categoria;
};

export const getCategoriasRecord = async () => {
  return await Categoria.find({ isActive: true }).sort({ nombreCategoria: 1 });
};
