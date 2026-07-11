import Group from './group.model.js';

export const seedGroups = async () => {
  try {
    // Verificar si hay grupos sin el campo cupoActual
    const groupsWithoutCupo = await Group.countDocuments({ cupoActual: { $exists: false } });
    
    if (groupsWithoutCupo > 0) {
      console.log('🔄 Actualizando grupos existentes para incluir campo cupoActual...');
      
      // Eliminar todos los grupos para recrearlos con el nuevo esquema
      await Group.deleteMany({});
      
      const groups = [
        {
          nombreGrupo: 'Coros',
          descripcion: 'Grupo de coro para las misas dominicales y celebraciones especiales',
          requisitos: 'Tener buena voz, disponibilidad los domingos y capacidad para aprender cantos litúrgicos',
          cupoMaximo: 30,
          cupoActual: 0,
          isActive: true
        },
        {
          nombreGrupo: 'Monaguillos',
          descripcion: 'Servicio litúrgico durante las misas y celebraciones',
          requisitos: 'Tener entre 8 y 16 años, disponibilidad para asistir a misas y capacitaciones',
          cupoMaximo: 20,
          cupoActual: 0,
          isActive: true
        },
        {
          nombreGrupo: 'Ministros Extraordinarios',
          descripcion: 'Ministros de la comunión que asisten en la distribución de la Eucaristía',
          requisitos: 'Ser confirmado, tener disponibilidad para misas dominicales y formación específica',
          cupoMaximo: 15,
          cupoActual: 0,
          isActive: true
        },
        {
          nombreGrupo: 'Catequistas',
          descripcion: 'Profesores de catecismo para la formación de niños y jóvenes',
          requisitos: 'Tener formación catequética, paciencia y disponibilidad los sábados',
          cupoMaximo: 25,
          cupoActual: 0,
          isActive: true
        },
        {
          nombreGrupo: 'Lectores',
          descripcion: 'Lectores de las lecturas bíblicas durante las misas',
          requisitos: 'Buena dicción, preparación previa de las lecturas y disponibilidad dominical',
          cupoMaximo: 20,
          cupoActual: 0,
          isActive: true
        },
        {
          nombreGrupo: 'Grupo Juvenil',
          descripcion: 'Grupo de jóvenes para actividades recreativas y formativas',
          requisitos: 'Tener entre 15 y 25 años, interés en actividades pastorales juveniles',
          cupoMaximo: 40,
          cupoActual: 0,
          isActive: true
        }
      ];

      await Group.insertMany(groups);
      console.log('✅ Grupos recreados correctamente con campo cupoActual');
    } else {
      const count = await Group.countDocuments();
      if (count === 0) {
        const groups = [
          {
            nombreGrupo: 'Coros',
            descripcion: 'Grupo de coro para las misas dominicales y celebraciones especiales',
            requisitos: 'Tener buena voz, disponibilidad los domingos y capacidad para aprender cantos litúrgicos',
            cupoMaximo: 30,
            cupoActual: 0,
            isActive: true
          },
          {
            nombreGrupo: 'Monaguillos',
            descripcion: 'Servicio litúrgico durante las misas y celebraciones',
            requisitos: 'Tener entre 8 y 16 años, disponibilidad para asistir a misas y capacitaciones',
            cupoMaximo: 20,
            cupoActual: 0,
            isActive: true
          },
          {
            nombreGrupo: 'Ministros Extraordinarios',
            descripcion: 'Ministros de la comunión que asisten en la distribución de la Eucaristía',
            requisitos: 'Ser confirmado, tener disponibilidad para misas dominicales y formación específica',
            cupoMaximo: 15,
            cupoActual: 0,
            isActive: true
          },
          {
            nombreGrupo: 'Catequistas',
            descripcion: 'Profesores de catecismo para la formación de niños y jóvenes',
            requisitos: 'Tener formación catequética, paciencia y disponibilidad los sábados',
            cupoMaximo: 25,
            cupoActual: 0,
            isActive: true
          },
          {
            nombreGrupo: 'Lectores',
            descripcion: 'Lectores de las lecturas bíblicas durante las misas',
            requisitos: 'Buena dicción, preparación previa de las lecturas y disponibilidad dominical',
            cupoMaximo: 20,
            cupoActual: 0,
            isActive: true
          },
          {
            nombreGrupo: 'Grupo Juvenil',
            descripcion: 'Grupo de jóvenes para actividades recreativas y formativas',
            requisitos: 'Tener entre 15 y 25 años, interés en actividades pastorales juveniles',
            cupoMaximo: 40,
            cupoActual: 0,
            isActive: true
          }
        ];

        await Group.insertMany(groups);
        console.log('✅ Grupos iniciales creados correctamente');
      } else {
        console.log('ℹ️ Los grupos ya existen en la base de datos con el esquema correcto');
      }
    }
  } catch (error) {
    console.error('❌ Error al inicializar grupos:', error);
  }
};
