import Categoria from './category.model.js';

export const seedCategorias = async (parroquiaId = null) => {
  try {
    // Solo crear categorías si se proporciona un parroquiaId
    if (!parroquiaId) {
      console.log('ℹ️ No se proporcionó parroquiaId, omitiendo seed de categorías');
      return;
    }

    // Verificar si ya existen categorías para esta parroquia
    const existingCategorias = await Categoria.find({ parroquiaId });
    
    // Si ya existen categorías, eliminar duplicados y recrear
    if (existingCategorias.length > 0) {
      console.log(`ℹ️ Limpiando categorías duplicadas para parroquia ${parroquiaId}`);
      await Categoria.deleteMany({ parroquiaId });
    }

    const categorias = [
      {
        parroquiaId,
        nombreCategoria: 'Litúrgico',
        descripcion: 'Eventos litúrgicos y celebraciones religiosas',
        isActive: true
      },
      {
        parroquiaId,
        nombreCategoria: 'Formativo',
        descripcion: 'Eventos de formación y educación religiosa',
        isActive: true
      },
      {
        parroquiaId,
        nombreCategoria: 'Juvenil',
        descripcion: 'Eventos y actividades para jóvenes',
        isActive: true
      },
      {
        parroquiaId,
        nombreCategoria: 'Comunitario',
        descripcion: 'Eventos y actividades comunitarias',
        isActive: true
      }
    ];

    await Categoria.insertMany(categorias);
    console.log(`✅ Categorías creadas para parroquia ${parroquiaId}`);
  } catch (error) {
    console.error('❌ Error al inicializar categorías:', error);
  }
};
