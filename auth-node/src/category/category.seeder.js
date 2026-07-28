import Categoria from './category.model.js';

export const seedCategorias = async (parroquiaId = null) => {
  try {
    // Solo crear categorías si se proporciona un parroquiaId
    if (!parroquiaId) {
      console.log('ℹ️ No se proporcionó parroquiaId, omitiendo seed de categorías');
      return;
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

    // Usar bulkWrite con upsert para evitar duplicados
    const bulkOps = categorias.map(cat => ({
      updateOne: {
        filter: { parroquiaId, nombreCategoria: cat.nombreCategoria },
        update: { $setOnInsert: cat },
        upsert: true
      }
    }));

    const result = await Categoria.bulkWrite(bulkOps);
    console.log(`✅ Categorías aseguradas para parroquia ${parroquiaId} (upserted: ${result.upsertedCount})`);
  } catch (error) {
    console.error('❌ Error al inicializar categorías:', error);
  }
};
