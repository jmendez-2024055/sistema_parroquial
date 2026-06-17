import Categoria from './category.model.js';

export const seedCategorias = async () => {
  try {
    const count = await Categoria.countDocuments();
    
    if (count === 0) {
      const categorias = [
        {
          nombreCategoria: 'Litúrgico',
          descripcion: 'Eventos litúrgicos y celebraciones religiosas',
          isActive: true
        },
        {
          nombreCategoria: 'Formativo',
          descripcion: 'Eventos de formación y educación religiosa',
          isActive: true
        },
        {
          nombreCategoria: 'Juvenil',
          descripcion: 'Eventos y actividades para jóvenes',
          isActive: true
        },
        {
          nombreCategoria: 'Comunitario',
          descripcion: 'Eventos y actividades comunitarias',
          isActive: true
        }
      ];

      await Categoria.insertMany(categorias);
      console.log('✅ Categorías inicializadas correctamente');
    } else {
      console.log('ℹ️ Las categorías ya existen en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error al inicializar categorías:', error);
  }
};
