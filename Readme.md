# sistema-parroquial

Sistema backend para la gestión de información de la **Parroquia San Cristóbal**, zona 11, Ciudad de Guatemala. Permite centralizar eventos, avisos, horarios de misa y usuarios mediante APIs REST probadas en Postman.

---

## Tecnologías

| Servicio | Tecnología |
|---|---|
| Autenticación (Auth) | .NET Web API (C#) + JWT |
| Roles, Categorías, Eventos, Avisos, Horarios | Node.js + Express |
| Base de datos | MongoDB + Mongoose |
| Pruebas | Postman |

---

## Integrantes

| Nombre | Rol | Sprint |
|---|---|---|
| José Carlos Cortez López | Desarrollador Backend | Sprint 1 – Usuario-Rol/Auth (.NET) |
| Mauricio Neftalí Xocoxic Patzán | Desarrollador Backend | Sprint 2 – Evento |
| Carlos Alejandro Sánchez Solares | Desarrollador Backend | Sprint 3 – Aviso |
| José Julián González Robles | Desarrollador Backend | Sprint 4 – Horario Misa |
| José Emilio Bolaños López | Product Owner | Sprint 5 – Categoria  |
| José Gerardo Méndez González | Scrum Master | Sprint 5 – INTEGRACIÓN |

---

## Instalación y ejecución

### Requisitos previos
- Node.js v18+
- .NET SDK 8+
- MongoDB 
- Postman

---

### 1. Clonar el repositorio

```bash
git clone hhttps://github.com/jmendez-2024055/parroquia_problema_social.git
cd sistema-parroquial
```

---

### 2. Servicio Auth (.NET)

```bash
cd auth-service
dotnet restore
dotnet run
```

> Corre en: `http://localhost:5000`

Configurar `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "tu_clave_secreta",
    "Issuer": "sistema-parroquial"
  }
}
```

---

### 3. Servicios Node.js

```bash
cd node-service
npm install
npm run dev
```

> Corre en: `http://localhost:3000`

Crear archivo `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/sistema-parroquial
JWT_SECRET=tu_clave_secreta
```

---

## Endpoints disponibles

> Todos los endpoints protegidos requieren el header:
> `Authorization: Bearer <token>`

---

### uth – `.NET` → `http://localhost:5000`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión, devuelve JWT | No |
| GET | `/api/usuarios` | Listar todos los usuarios | Sí |
| GET | `/api/usuarios/:id` | Obtener usuario por ID | Sí |

**Body – POST /api/auth/register**
```json
{
  "nombre": "Luis",
  "apellido": "Garcia",
  "correo": "Luis@gmail.com",
  "contrasena": "453245",
  "idRol": 1
}
```

**Body – POST /api/auth/login**
```json
{
  "correo": "Luis@gmail.com",
  "contrasena": "123456"
}
```

---

###  Roles – `http://localhost:3000`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/roles` | Crear nuevo rol | Sí |
| GET | `/api/roles` | Listar todos los roles | No |

**Body – POST /api/roles**
```json
{
  "nombreRol": "Administrador"
}
```

---

###  Categorías – `http://localhost:3000`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/categorias` | Crear nueva categoría | Sí |
| GET | `/api/categorias` | Listar todas las categorías | No |

**Body – POST /api/categorias**
```json
{
  "nombreCategoria": "Litúrgico",
  "descripcion": "Actividades del culto y liturgia"
}
```

---

### Eventos – `http://localhost:3000`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/eventos` | Crear nuevo evento | Sí |
| GET | `/api/eventos` | Listar todos los eventos | No |
| GET | `/api/eventos/:id` | Obtener evento por ID | No |
| GET | `/api/eventos/categoria/:idCategoria` | Listar eventos por categoría | No |

**Body – POST /api/eventos**
```json
{
  "titulo": "Misa de Navidad",
  "descripcion": "Celebración de la Natividad del Señor",
  "fecha": "2026-12-25",
  "hora": "20:00",
  "lugar": "Iglesia San Cristóbal",
  "idCategoria": "64abc123..."
}
```

---

### Avisos – `http://localhost:3000`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/avisos` | Crear nuevo aviso | Sí |
| GET | `/api/avisos` | Listar todos los avisos | No |
| GET | `/api/avisos/:id` | Obtener aviso por ID | No |

**Body – POST /api/avisos**
```json
{
  "titulo": "Suspensión de actividades",
  "contenido": "Se suspenden las actividades del viernes por mantenimiento.",
  "fechaPublicacion": "2026-03-01",
  "idUsuario": "64abc456..."
}
```

---

### Horarios de Misa – `http://localhost:3000`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/horarios` | Crear nuevo horario | Sí |
| GET | `/api/horarios` | Listar todos los horarios | No |

**Body – POST /api/horarios**
```json
{
  "diaSemana": "Domingo",
  "hora": "09:00",
  "tipoMisa": "Misa Dominical",
  "celebrante": "Padre Carlos Méndez"
}
```

---

## Estructura del proyecto

```
sistema-parroquial/
├── auth-service/          # Servicio .NET (Autenticación)
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── appsettings.json
├── node-service/          # Servicios Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middlewares/
│   ├── .env
│   └── package.json
└── README.md
```

---

## Licencia

Proyecto académico – Centro Educativo Técnico Laboral Kinal · Curso Tecnología · 2026
