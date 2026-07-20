import Group from './group.model.js';

export const seedGroups = async (parroquiaId = null) => {
  try {
    // Solo crear grupos si se proporciona un parroquiaId
    if (!parroquiaId) {
      console.log('ℹ️ No se proporcionó parroquiaId, omitiendo seed de grupos');
      return;
    }

    const count = await Group.countDocuments({ parroquiaId });

    if (count === 0) {
      const groups = [
        {
          parroquiaId,
          nombreGrupo: 'Coros',
          descripcion: 'Grupo de coro para las misas dominicales y celebraciones especiales',
          requisitos: 'Tener buena voz, disponibilidad los domingos y capacidad para aprender cantos litúrgicos',
          cupoMaximo: 30,
          cupoActual: 0,
          isActive: true
        },
        {
          parroquiaId,
          nombreGrupo: 'Monaguillos',
          descripcion: 'Servicio litúrgico durante las misas y celebraciones',
          requisitos: 'Tener entre 8 y 16 años, disponibilidad para asistir a misas y capacitaciones',
          cupoMaximo: 20,
          cupoActual: 0,
          isActive: true
        },
        {
          parroquiaId,
          nombreGrupo: 'Ministros Extraordinarios',
          descripcion: 'Ministros de la comunión que asisten en la distribución de la Eucaristía',
          requisitos: 'Ser confirmado, tener disponibilidad para misas dominicales y formación específica',
          cupoMaximo: 15,
          cupoActual: 0,
          isActive: true
        },
        {
          parroquiaId,
          nombreGrupo: 'Catequistas',
          descripcion: 'Profesores de catecismo para la formación de niños y jóvenes',
          requisitos: 'Tener formación catequética, paciencia y disponibilidad los sábados',
          cupoMaximo: 25,
          cupoActual: 0,
          isActive: true
        },
        {
          parroquiaId,
          nombreGrupo: 'Lectores',
          descripcion: 'Lectores de las lecturas bíblicas durante las misas',
          requisitos: 'Buena dicción, preparación previa de las lecturas y disponibilidad dominical',
          cupoMaximo: 20,
          cupoActual: 0,
          isActive: true
        },
        {
          parroquiaId,
          nombreGrupo: 'Grupo Juvenil',
          descripcion: 'Grupo de jóvenes para actividades recreativas y formativas',
          requisitos: 'Tener entre 15 y 25 años, interés en actividades pastorales juveniles',
          cupoMaximo: 40,
          cupoActual: 0,
          isActive: true
        }
      ];

      await Group.insertMany(groups);
      console.log(`✅ Grupos creados para parroquia ${parroquiaId}`);
    } else {
      console.log(`ℹ️ Los grupos ya existen para parroquia ${parroquiaId}`);
    }
  } catch (error) {
    console.error('❌ Error al inicializar grupos:', error);
  }
};
