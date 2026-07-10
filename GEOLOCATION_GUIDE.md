# Guía de Implementación de Geolocalización

## Resumen de Cambios

Se ha implementado la funcionalidad de geolocalización para que el sistema pueda detectar la ubicación del usuario y asignarle automáticamente la parroquia más cercana.

## Cambios Realizados

### Backend (Node.js - auth-node)

1. **Modelo de Parroquia** (`src/parish/parish.model.js`)
   - Campos: nombre, dirección, ubicación (latitud/longitud), contacto, horarios, descripción
   - Índices geoespaciales para búsquedas de proximidad

2. **Servicio de Parroquias** (`src/parish/parish.service.js`)
   - Cálculo de distancia usando fórmula de Haversine
   - Búsqueda de parroquia más cercana
   - Búsqueda de parroquias dentro de un radio específico
   - CRUD completo de parroquias

3. **Controlador de Parroquias** (`src/parish/parish.controller.js`)
   - Endpoints para gestión de parroquias
   - Endpoint `/nearest` para encontrar parroquia más cercana
   - Endpoint `/nearby` para buscar parroquias en un radio

4. **Rutas de Parroquias** (`src/parish/parish.routes.js`)
   - Integración en `/SistemaParroquial/v1/parroquias`

5. **Seeder de Parroquias** (`src/parish/parish.seeder.js`)
   - 5 parroquias de ejemplo en Ciudad de Guatemala
   - Coordenadas reales para pruebas

### Backend (.NET - Authentication-Service)

1. **Modelo de Usuario** (`AuthService.Domain/Entities/User.cs`)
   - Campo `ParishId` agregado

2. **DTOs Actualizados**
   - `RegisterDto`: Campos `Latitude`, `Longitude`, `ParishId`
   - `UserResponseDto`: Campos `ParishId`, `ParishName`

3. **Servicio de Parroquias** (`AuthService.Application/Services/ParishService.cs`)
   - Cliente HTTP para comunicarse con API de Node.js
   - Métodos para buscar parroquia más cercana y por ID

4. **Servicio de Autenticación** (`AuthService.Application/Services/AuthServices.cs`)
   - Lógica para asignar automáticamente parroquia más cercana durante registro
   - Soporte para selección manual de parroquia

5. **Configuración** (`appsettings.json`)
   - Configuración de `ParishApi:BaseUrl`

### Frontend (React - admin-sistema)

1. **Hook de Geolocalización** (`src/shared/hooks/useGeolocation.js`)
   - Obtener coordenadas del navegador
   - Manejo de errores y permisos

2. **Servicio de API de Parroquias** (`src/shared/services/parishService.js`)
   - Cliente Axios para comunicación con backend
   - Todos los métodos CRUD y geolocalización

3. **Componente de Selección de Parroquia** (`src/features/parish/components/ParishSelection.jsx`)
   - Interfaz para seleccionar parroquia
   - Búsqueda por nombre/dirección
   - Visualización de parroquia más cercana
   - Lista de parroquias cercanas

4. **Store de Parroquias** (`src/features/parish/store/useParishStore.js`)
   - Gestión de estado con Zustand

5. **Dashboard Actualizado** (`src/features/dashboard/pages/DashboardPage.jsx`)
   - Muestra información de la parroquia del usuario
   - Banner con nombre y dirección de la parroquia

6. **Formulario de Registro** (`src/features/auth/pages/RegisterPage.jsx`)
   - Integración de geolocalización
   - Modal de selección de parroquia
   - Envío de coordenadas al backend

## Endpoints API

### Parroquias (Node.js - Puerto 3000)

- `GET /SistemaParroquial/v1/parroquias` - Listar todas las parroquias
- `GET /SistemaParroquial/v1/parroquias/:id` - Obtener parroquia por ID
- `GET /SistemaParroquial/v1/parroquias/nearest?lat=X&lon=Y&maxDistance=Z` - Parroquia más cercana
- `GET /SistemaParroquial/v1/parroquias/nearby?lat=X&lon=Y&radius=Z` - Parroquias en radio
- `POST /SistemaParroquial/v1/parroquias` - Crear parroquia
- `PUT /SistemaParroquial/v1/parroquias/:id` - Actualizar parroquia
- `DELETE /SistemaParroquial/v1/parroquias/:id` - Eliminar parroquia (soft delete)

### Autenticación (.NET - Puerto 5000)

- `POST /api/v1/auth/register` - Registro con coordenadas y parroquia
  - Body: `{ Name, Surname, Username, Email, Password, Phone, Latitude, Longitude, ParishId }`

## Instrucciones de Prueba

### 1. Configurar Variables de Entorno

**Frontend (admin-sistema/.env):**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH_API_BASE_URL=http://localhost:5000
```

**Backend Node.js (auth-node/.env):**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/sistema-parroquial
```

**Backend .NET (Authentication-Service/appsettings.json):**
```json
{
  "ParishApi": {
    "BaseUrl": "http://localhost:3000"
  }
}
```

### 2. Ejecutar Seeder de Parroquias

```bash
cd auth-node
node src/parish/parish.seeder.js
```

Esto creará 5 parroquias de ejemplo en Ciudad de Guatemala.

### 3. Iniciar Servicios

**Servicio de Parroquias (Node.js):**
```bash
cd auth-node
npm run dev
```

**Servicio de Autenticación (.NET):**
```bash
cd Authentication-Service/Auth-Service
dotnet run
```

**Frontend (React):**
```bash
cd admin-sistema
npm run dev
```

### 4. Probar Funcionalidad

1. **Registro con Geolocalización:**
   - Ir a `http://localhost:5173/register`
   - Completar formulario de registro
   - Hacer clic en "📍 Seleccionar mi parroquia"
   - Permitir acceso a ubicación del navegador
   - Ver parroquia más cercana sugerida
   - Seleccionar parroquia y completar registro

2. **Ver Dashboard:**
   - Iniciar sesión con el usuario creado
   - Ver banner con información de la parroquia asignada
   - Ver eventos y horarios filtrados por parroquia

### 5. Probar Endpoints Directamente

**Encontrar parroquia más cercana:**
```bash
curl "http://localhost:3000/SistemaParroquial/v1/parroquias/nearest?lat=14.6133&lon=-90.5353"
```

**Listar parroquias cercanas:**
```bash
curl "http://localhost:3000/SistemaParroquial/v1/parroquias/nearby?lat=14.6133&lon=-90.5353&radius=10"
```

**Crear parroquia:**
```bash
curl -X POST http://localhost:3000/SistemaParroquial/v1/parroquias \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nueva Parroquia",
    "direccion": "Dirección de prueba",
    "ubicacion": {
      "latitud": 14.6000,
      "longitud": -90.5200
    },
    "contacto": {
      "telefono": "+502 2222-0000",
      "email": "test@parroquia.gt"
    }
  }'
```

## Parroquias de Ejemplo

El seeder crea las siguientes parroquias en Ciudad de Guatemala:

1. **Parroquia San Cristóbal** - Zona 11 (14.6133, -90.5353)
2. **Parroquia Nuestra Señora del Rosario** - Zona 1 (14.6370, -90.5130)
3. **Parroquia San Francisco de Asís** - Zona 9 (14.6100, -90.5200)
4. **Parroquia Santo Domingo de Guzmán** - Zona 13 (14.5900, -90.5500)
5. **Parroquia San José** - Zona 6 (14.6200, -90.5100)

## Notas Importantes

1. **Permisos de Ubicación:** Los usuarios deben permitir el acceso a su ubicación en el navegador
2. **Radio de Búsqueda:** Por defecto es 50km, configurable en los endpoints
3. **Fallback:** Si no se obtiene ubicación, el usuario puede seleccionar parroquia manualmente
4. **Base de Datos:** Se requiere MongoDB corriendo en `localhost:27017`
5. **Comunicación entre Servicios:** El servicio .NET necesita acceso al API de Node.js

## Próximos Pasos Sugeridos

1. Agregar mapa interactivo (Leaflet o Google Maps)
2. Implementar caché de parroquias para mejorar rendimiento
3. Agregar filtros por tipo de misa y horarios
4. Implementar notificaciones push para eventos de la parroquia
5. Agregar sistema de calificación y reseñas de parroquias
