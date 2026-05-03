# ADEII Web — Portal de la Asociación Estudiantil

Portal web fullstack para la Asociación de Estudiantes de Ingeniería informatica (ADEII).

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Tipografía | Slabo 27px (Google Fonts) |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL) |
| Storage (PDFs) | Supabase Storage |

## Páginas incluidas (basadas en Stitch)

| Ruta | Página |
|---|---|
| `/` | Inicio (Hero, Servicios, Próximos Eventos) |
| `/quienes-somos` | Quiénes Somos (Misión, Visión, Comisión Directiva) |
| `/eventos` | Galería y Eventos |
| `/apuntes` | Repositorio de Apuntes (PDFs desde Supabase Storage) |
| `/validar-certificado` | Validación de Certificados |
| `/login` | Ingresar (autenticación Supabase Auth) |
| `/mi-panel` | Panel del Estudiante (plan de estudio, certificados) |
| `/admin` | Panel Administrativo (usuarios, documentos) |

## Tablas Supabase utilizadas

`asociacion` · `carreras` · `certificados` · `documentos` · `eventos` · `inscripciones_eventos` · `inscripciones_talleres` · `materias` · `plan_estudio` · `redes_sociales` · `talleres` · `usuarios`

---

## Instalación y configuración

### Prerrequisitos

- Node.js 18+
- npm 9+

### 1. Clonar / abrir el proyecto

```bash
cd C:\Users\natal\Documentos\adeii-web
```

### 2. Configurar variables de entorno

#### Frontend (`client/.env`)

```env
VITE_SUPABASE_URL=https://swtbggulhrwgbkmdmjau.supabase.co
VITE_SUPABASE_ANON_KEY=<tu_anon_key>
```

#### Backend (`server/.env`)

```env
PORT=3000
SUPABASE_URL=https://swtbggulhrwgbkmdmjau.supabase.co
SUPABASE_ANON_KEY=<tu_anon_key>
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Instalar dependencias

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

### 4. Ejecutar en modo desarrollo

#### Frontend (en una terminal)

```bash
cd client
npm run dev
```

→ Corre en `http://localhost:5173`

#### Backend (en otra terminal)

```bash
cd server
npm run dev
```

→ Corre en `http://localhost:3000`
→ Health check: `http://localhost:3000/api/health`

---

## Estructura del proyecto

```
adeii-web/
├── client/                        # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Barra de navegación sticky
│   │   │   ├── Footer.jsx         # Pie de página con datos de asociacion
│   │   │   ├── Layout.jsx         # Wrapper Navbar + Outlet + Footer
│   │   │   ├── Skeleton.jsx       # Carga skeleton shimmer
│   │   │   ├── StatusBadge.jsx    # Badges de estado (enums Supabase)
│   │   │   └── ErrorMessage.jsx   # Pantalla de error
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── QuienesSomosPage.jsx
│   │   │   ├── EventosPage.jsx
│   │   │   ├── ApuntesPage.jsx
│   │   │   ├── ValidarCertificadoPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MiPanelPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── services/
│   │   │   ├── supabaseClient.js  # Cliente Supabase
│   │   │   ├── asociacionService.js
│   │   │   ├── eventosService.js
│   │   │   ├── documentosService.js (+ Storage upload)
│   │   │   ├── talleresService.js
│   │   │   └── usuariosService.js
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Auth + asociacion global
│   │   ├── hooks/
│   │   │   └── useFetch.js        # Hook genérico de datos async
│   │   ├── App.jsx                # Router con todas las rutas
│   │   ├── main.jsx
│   │   └── index.css              # Tailwind + Slabo 27px + design tokens
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
└── server/                        # Backend Node.js + Express
    ├── src/
    │   ├── controllers/
    │   │   ├── asociacionController.js
    │   │   ├── eventosController.js
    │   │   ├── documentosController.js
    │   │   ├── certificadosController.js
    │   │   └── usuariosController.js
    │   ├── routes/
    │   │   ├── asociacion.js
    │   │   ├── eventos.js
    │   │   ├── documentos.js
    │   │   ├── talleres.js
    │   │   └── usuarios.js
    │   ├── database/
    │   │   └── supabase.js        # Cliente Supabase server-side
    │   ├── middlewares/
    │   │   └── errorHandler.js
    │   └── utils/
    ├── server.js                  # Configuración Express
    ├── index.js                   # Entry point
    ├── .env
    └── package.json
```

## Endpoints API (backend)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/asociacion` | Datos de la asociación |
| `GET` | `/api/asociacion/:id/redes` | Redes sociales activas |
| `GET` | `/api/eventos` | Listar eventos (filtro ?tipo=) |
| `GET` | `/api/eventos/:id` | Detalle de evento |
| `POST` | `/api/eventos/:id/inscribir` | Inscribir usuario a evento |
| `GET` | `/api/documentos` | Listar documentos aprobados |
| `PATCH` | `/api/documentos/:id/aprobar` | Aprobar documento (admin) |
| `GET` | `/api/carreras` | Listar carreras |
| `GET` | `/api/materias` | Listar materias (filtro ?carrera_id=) |
| `GET` | `/api/talleres` | Listar talleres activos |
| `GET` | `/api/certificados/validar/:codigo` | Validar certificado |
| `GET` | `/api/certificados/usuario/:id` | Certificados de un usuario |
| `GET` | `/api/usuarios` | Listar usuarios (admin) |
| `GET` | `/api/usuarios/comision` | Comisión directiva |
| `GET` | `/api/usuarios/:id/plan-estudio` | Plan de estudio del usuario |

## Supabase Storage

Los PDFs de documentos y certificados se almacenan en **Supabase Storage**.

- **Bucket**: `documentos` (configurar en el dashboard de Supabase)
- **URLs**: públicas, vinculadas directamente desde `documentos.archivo_url` y `certificados.archivo_url`
- **Subida**: via `documentosService.subirDocumento()` en el frontend

## Notas de desarrollo

- El frontend consume Supabase **directamente** (sin pasar por el backend) para operaciones de lectura.
- El backend Express está preparado para lógica futura (autenticación server-side, envío de emails, etc.).
- RLS (Row Level Security) está habilitado en todas las tablas de Supabase.
- La autenticación usa **Supabase Auth** integrado en `AppContext`.
