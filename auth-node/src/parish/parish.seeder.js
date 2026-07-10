import 'dotenv/config';
import Parish from './parish.model.js';
import mongoose from 'mongoose';

const parroquiasEjemplo = [
  {
    nombre: 'Parroquia San Cristóbal',
    direccion: 'Zona 11, Ciudad de Guatemala',
    ubicacion: {
      latitud: 14.6133,
      longitud: -90.5353
    },
    contacto: {
      telefono: '+502 2222-0000',
      email: 'sancristobal@parroquia.gt',
      paginaWeb: 'https://sancristobal.parroquia.gt'
    },
    horarios: [
      {
        dia: 'Domingo',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Matutina' },
          { hora: '09:00', tipoMisa: 'Misa Principal' },
          { hora: '11:00', tipoMisa: 'Misa Solemne' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Lunes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Martes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Miércoles',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Jueves',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Viernes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Sábado',
        horarios: [
          { hora: '08:00', tipoMisa: 'Misa Matutina' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      }
    ],
    descripcion: 'Parroquia principal de la zona 11, dedicada a San Cristóbal. Centro de vida espiritual y comunitaria.',
    imagen: '',
    isActive: true
  },
  {
    nombre: 'Parroquia Nuestra Señora del Rosario',
    direccion: 'Zona 1, Centro Histórico, Ciudad de Guatemala',
    ubicacion: {
      latitud: 14.6370,
      longitud: -90.5130
    },
    contacto: {
      telefono: '+502 2223-1111',
      email: 'rosario@parroquia.gt',
      paginaWeb: 'https://rosario.parroquia.gt'
    },
    horarios: [
      {
        dia: 'Domingo',
        horarios: [
          { hora: '08:00', tipoMisa: 'Misa Principal' },
          { hora: '10:00', tipoMisa: 'Misa Solemne' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Lunes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Martes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Miércoles',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Jueves',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Viernes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Sábado',
        horarios: [
          { hora: '09:00', tipoMisa: 'Misa Matutina' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      }
    ],
    descripcion: 'Histórica parroquia del Rosario en el centro de la ciudad, patrimonio cultural y religioso.',
    imagen: '',
    isActive: true
  },
  {
    nombre: 'Parroquia San Francisco de Asís',
    direccion: 'Zona 9, Ciudad de Guatemala',
    ubicacion: {
      latitud: 14.6100,
      longitud: -90.5200
    },
    contacto: {
      telefono: '+502 2224-2222',
      email: 'sanfrancisco@parroquia.gt',
      paginaWeb: 'https://sanfrancisco.parroquia.gt'
    },
    horarios: [
      {
        dia: 'Domingo',
        horarios: [
          { hora: '07:30', tipoMisa: 'Misa Matutina' },
          { hora: '10:00', tipoMisa: 'Misa Principal' },
          { hora: '12:00', tipoMisa: 'Misa del Mediodía' },
          { hora: '18:30', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Lunes',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Martes',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Miércoles',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Jueves',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Viernes',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Sábado',
        horarios: [
          { hora: '08:00', tipoMisa: 'Misa Matutina' },
          { hora: '17:00', tipoMisa: 'Misa Vespertina' }
        ]
      }
    ],
    descripcion: 'Parroquia franciscana dedicada a la vida contemplativa y servicio a los más necesitados.',
    imagen: '',
    isActive: true
  },
  {
    nombre: 'Parroquia Santo Domingo de Guzmán',
    direccion: 'Zona 13, Ciudad de Guatemala',
    ubicacion: {
      latitud: 14.5900,
      longitud: -90.5500
    },
    contacto: {
      telefono: '+502 2225-3333',
      email: 'santodomingo@parroquia.gt',
      paginaWeb: 'https://santodomingo.parroquia.gt'
    },
    horarios: [
      {
        dia: 'Domingo',
        horarios: [
          { hora: '08:00', tipoMisa: 'Misa Principal' },
          { hora: '11:00', tipoMisa: 'Misa Solemne' },
          { hora: '19:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Lunes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Martes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Miércoles',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Jueves',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Viernes',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Sábado',
        horarios: [
          { hora: '09:00', tipoMisa: 'Misa Matutina' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      }
    ],
    descripcion: 'Parroquia dominica enfocada en la educación y formación cristiana de la comunidad.',
    imagen: '',
    isActive: true
  },
  {
    nombre: 'Parroquia San José',
    direccion: 'Zona 6, Ciudad de Guatemala',
    ubicacion: {
      latitud: 14.6200,
      longitud: -90.5100
    },
    contacto: {
      telefono: '+502 2226-4444',
      email: 'sanjose@parroquia.gt',
      paginaWeb: 'https://sanjose.parroquia.gt'
    },
    horarios: [
      {
        dia: 'Domingo',
        horarios: [
          { hora: '07:00', tipoMisa: 'Misa Matutina' },
          { hora: '09:30', tipoMisa: 'Misa Principal' },
          { hora: '12:00', tipoMisa: 'Misa del Mediodía' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Lunes',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Martes',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Miércoles',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Jueves',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Viernes',
        horarios: [
          { hora: '06:30', tipoMisa: 'Misa Diaria' },
          { hora: '18:00', tipoMisa: 'Misa Vespertina' }
        ]
      },
      {
        dia: 'Sábado',
        horarios: [
          { hora: '08:00', tipoMisa: 'Misa Matutina' },
          { hora: '17:30', tipoMisa: 'Misa Vespertina' }
        ]
      }
    ],
    descripcion: 'Parroquia dedicada a San José, patrono de los trabajadores y las familias.',
    imagen: '',
    isActive: true
  }
];

const seedParishes = async () => {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.URI_MONGODB || 'mongodb://localhost:27017/sistema-parroquial');
    console.log('Conectado a MongoDB');

    // Limpiar parroquias existentes (opcional)
    const count = await Parish.countDocuments();
    if (count > 0) {
      console.log(`Se encontraron ${count} parroquias existentes. ¿Deseas eliminarlas? (Descomenta la línea siguiente)`);
      // await Parish.deleteMany({});
      // console.log('Parroquias existentes eliminadas');
    }

    // Insertar parroquias de ejemplo
    console.log('Insertando parroquias de ejemplo...');
    const insertedParishes = await Parish.insertMany(parroquiasEjemplo);
    console.log(`${insertedParishes.length} parroquias insertadas exitosamente:`);
    
    insertedParishes.forEach(parish => {
      console.log(`- ${parish.nombre} (${parish.ubicacion.latitud}, ${parish.ubicacion.longitud})`);
    });

    console.log('Seeder de parroquias completado exitosamente');
  } catch (error) {
    console.error('Error al ejecutar seeder de parroquias:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
};

// Ejecutar seeder solo si se llama directamente (no al importar)
if (import.meta.url === `file://${process.argv[1]}`) {
  seedParishes();
}

export default seedParishes;
