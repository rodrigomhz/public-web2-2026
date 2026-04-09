# Ejercicio T9: API de Biblioteca con Supabase + Prisma

## Descripción

Construye una API REST para gestionar una biblioteca digital usando **Supabase** como base de datos PostgreSQL y **Prisma** como ORM.

## Historia

La biblioteca municipal quiere digitalizar su sistema de préstamos. Los usuarios podrán:
- Consultar el catálogo de libros
- Solicitar préstamos (máximo 3 libros simultáneos)
- Dejar reseñas con puntuación
- Los administradores gestionan el inventario

## Requisitos

### Modelos de datos

```
User
├── id (autoincrement)
├── email (unique)
├── name
├── password (hash)
├── role (USER | LIBRARIAN | ADMIN)
├── loans[] (relación)
└── reviews[] (relación)

Book
├── id (autoincrement)
├── isbn (unique)
├── title
├── author
├── genre
├── description (opcional)
├── publishedYear
├── copies (número de ejemplares)
├── available (ejemplares disponibles)
├── loans[] (relación)
└── reviews[] (relación)

Loan
├── id (autoincrement)
├── userId (FK → User)
├── bookId (FK → Book)
├── loanDate
├── dueDate (fecha límite)
├── returnDate (nullable)
└── status (ACTIVE | RETURNED | OVERDUE)

Review
├── id (autoincrement)
├── userId (FK → User)
├── bookId (FK → Book)
├── rating (1-5)
├── comment (opcional)
├── createdAt
└── (unique: userId + bookId)
```

### Endpoints

#### Auth
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /api/auth/register | Registrar usuario | Público |
| POST | /api/auth/login | Iniciar sesión | Público |
| GET | /api/auth/me | Obtener perfil | Autenticado |

#### Books
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | /api/books | Listar libros (con filtros) | Público |
| GET | /api/books/:id | Obtener libro por ID | Público |
| POST | /api/books | Crear libro | Librarian/Admin |
| PUT | /api/books/:id | Actualizar libro | Librarian/Admin |
| DELETE | /api/books/:id | Eliminar libro | Admin |

#### Loans
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | /api/loans | Mis préstamos | Autenticado |
| GET | /api/loans/all | Todos los préstamos | Librarian/Admin |
| POST | /api/loans | Solicitar préstamo | Autenticado |
| PUT | /api/loans/:id/return | Devolver libro | Autenticado |

#### Reviews
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | /api/books/:id/reviews | Reseñas de un libro | Público |
| POST | /api/books/:id/reviews | Crear reseña | Autenticado |
| DELETE | /api/reviews/:id | Eliminar mi reseña | Autenticado |

### Reglas de negocio

1. **Préstamos**:
   - Un usuario puede tener máximo 3 préstamos activos
   - No puede pedir prestado el mismo libro dos veces
   - Solo se puede prestar si hay ejemplares disponibles
   - Duración del préstamo: 14 días

2. **Reseñas**:
   - Solo una reseña por usuario por libro
   - Rating entre 1 y 5
   - Solo usuarios que hayan leído el libro pueden reseñar (tengan préstamo devuelto)

3. **Inventario**:
   - `copies`: total de ejemplares
   - `available`: ejemplares disponibles para préstamo
   - Al prestar: `available--`
   - Al devolver: `available++`

## Configuración

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia el `DATABASE_URL` de Settings → Database

### 2. Instalar dependencias

```bash
cd ejercicios/T9
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Ejecutar migraciones

```bash
npx prisma migrate dev --name init
```

### 5. (Opcional) Sembrar datos de prueba

```bash
npx prisma db seed
```

### 6. Iniciar servidor

```bash
npm run dev
```

## Scripts

```bash
npm run dev          # Servidor con hot-reload
npm start            # Servidor en producción
npm run db:studio    # Abrir Prisma Studio
npm run db:migrate   # Crear migración
npm run db:push      # Sincronizar schema sin migración
npm run db:seed      # Sembrar datos de prueba
npm test             # Ejecutar tests
```

## Estructura del proyecto

```
T9/
├── prisma/
│   ├── schema.prisma      # Definición de modelos
│   ├── migrations/        # Historial de migraciones
│   └── seed.js           # Datos de prueba
├── src/
│   ├── app.js            # Configuración Express
│   ├── config/
│   │   └── prisma.js     # Cliente Prisma
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── books.controller.js
│   │   ├── loans.controller.js
│   │   └── reviews.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── books.routes.js
│   │   ├── loans.routes.js
│   │   └── reviews.routes.js
│   ├── schemas/
│   │   └── validation.js
│   └── utils/
│       ├── password.js
│       └── jwt.js
├── tests/
│   └── api.http          # Tests con REST Client
├── .env.example
├── package.json
└── README.md
```

## Criterios de éxito

- [ ] Prisma schema con todos los modelos y relaciones
- [ ] Migraciones aplicadas correctamente en Supabase
- [ ] CRUD completo de libros
- [ ] Sistema de préstamos funcionando
- [ ] Control de inventario (available)
- [ ] Reseñas con validación
- [ ] Autenticación JWT
- [ ] Manejo de errores de Prisma

## Bonus

- [ ] Documentación Swagger
- [ ] Tests con Jest + Supertest
- [ ] Filtros avanzados (género, autor, disponibilidad)
- [ ] Paginación en listados
- [ ] Endpoint de estadísticas (libros más prestados, mejores valorados)
- [ ] Notificación de préstamos vencidos

---

## Fase Extra: Funcionalidades Avanzadas

Una vez completada la API básica, añade estas funcionalidades que integran los temas T10, T11 y T13.

### 1. Subida de Imágenes (T13)

#### Nuevos campos en modelos

```prisma
// Añadir a User
avatar         String?   // URL de imagen de perfil
avatarPublicId String?   // ID en Cloudinary para eliminar

// Añadir a Book
coverImage     String?   // URL de portada del libro
coverPublicId  String?   // ID en Cloudinary
```

#### Nuevos endpoints

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /api/users/avatar | Subir avatar de usuario | Autenticado |
| DELETE | /api/users/avatar | Eliminar avatar | Autenticado |
| POST | /api/books/:id/cover | Subir portada de libro | Librarian/Admin |
| DELETE | /api/books/:id/cover | Eliminar portada | Librarian/Admin |

#### Dependencias adicionales

```bash
npm install multer cloudinary sharp
```

#### Configuración Cloudinary

```bash
# Añadir a .env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

#### Archivos a crear

```
src/
├── config/
│   ├── cloudinary.js      # Configuración Cloudinary
│   └── multer.js          # Configuración Multer
├── services/
│   └── upload.service.js  # Lógica de subida
├── controllers/
│   └── upload.controller.js
└── routes/
    └── upload.routes.js
```

### 2. Notificaciones en Tiempo Real (T10)

Implementar Socket.IO para notificar eventos en tiempo real.

#### Eventos a emitir

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `book:new` | Nuevo libro añadido | `{ book }` |
| `book:borrowed` | Libro prestado | `{ book, user, available }` |
| `book:returned` | Libro devuelto | `{ book, user, available }` |
| `loan:overdue` | Préstamo vencido | `{ loan, user }` |

#### Dependencias

```bash
npm install socket.io
```

#### Archivos a crear

```
src/
├── socket/
│   ├── index.js           # Configuración Socket.IO
│   └── notifications.js   # Emisión de eventos
└── app.js                 # Modificar para usar HTTP server
```

#### Ejemplo de uso

```javascript
// En el controller de loans al crear préstamo
import { emitBookBorrowed } from '../socket/notifications.js';

// Después de crear el préstamo
emitBookBorrowed(io, { book, user, available: book.available });
```

### 3. Containerización con Docker (T11)

Preparar la aplicación para deployment con Docker.

#### Archivos a crear

```
T9/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── nginx/
    └── nginx.conf         # (Opcional) Reverse proxy
```

#### Dockerfile básico

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY src ./src/

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/app.js"]
```

#### docker-compose.yml

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

### 4. Frontend de Gestión (Bonus)

Crear un panel de administración simple:

```
public/
├── index.html       # Dashboard
├── books.html       # Gestión de libros
├── upload.html      # Subida de portadas
└── css/
    └── styles.css
```

### Criterios de éxito - Fase Extra

- [ ] Subida de avatares de usuario funcionando
- [ ] Subida de portadas de libros funcionando
- [ ] Imágenes optimizadas con Sharp antes de subir
- [ ] Socket.IO emitiendo eventos de préstamos
- [ ] Dockerfile construyendo correctamente
- [ ] docker-compose levantando los servicios
- [ ] Variables de entorno documentadas

### Estructura final del proyecto

```
T9/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── prisma.js
│   │   ├── cloudinary.js    # NUEVO
│   │   └── multer.js        # NUEVO
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── books.controller.js
│   │   ├── loans.controller.js
│   │   ├── reviews.controller.js
│   │   └── upload.controller.js  # NUEVO
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js  # NUEVO
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── books.routes.js
│   │   ├── loans.routes.js
│   │   ├── reviews.routes.js
│   │   └── upload.routes.js      # NUEVO
│   ├── services/
│   │   └── upload.service.js     # NUEVO
│   ├── socket/                   # NUEVO
│   │   ├── index.js
│   │   └── notifications.js
│   └── utils/
│       ├── password.js
│       └── jwt.js
├── public/                       # NUEVO (opcional)
│   └── index.html
├── tests/
│   └── api.http
├── Dockerfile                    # NUEVO
├── docker-compose.yml            # NUEVO
├── .dockerignore                 # NUEVO
├── .env.example
├── package.json
└── README.md
```

## Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Teoría T9 - Supabase + Prisma](../../teoria/T9.md)
- [Teoría T10 - WebSockets](../../teoria/T10.md)
- [Teoría T11 - Deploy y DevOps](../../teoria/T11.md)
- [Teoría T13 - Subida de Archivos](../../teoria/T13.md)
