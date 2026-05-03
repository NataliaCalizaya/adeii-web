// ============================================================
// MOCK DATA — usado en branch-1 (GitHub Pages / demo mode)
// ============================================================

export const MOCK_ASOCIACION = {
  id: 1,
  nombre: 'ADEII',
  nombre_completo: 'Asociación de Estudiantes de Ingeniería informatica',
  mision: 'Representar y defender los intereses de los estudiantes de Ingeniería informatica, fomentando la participación estudiantil, el desarrollo académico y la vinculación con el mundo profesional.',
  vision: 'Ser la referencia estudiantil de excelencia en la facultad, construyendo una comunidad activa, inclusiva y comprometida con la formación integral de sus miembros.',
  descripcion: 'Somos la asociación estudiantil que nuclea a todos los alumnos de Ingeniería informatica de la facultad. Organizamos eventos, gestionamos recursos académicos y representamos a los estudiantes ante las autoridades.',
  email_contacto: 'adeii@fi.uba.ar',
  activo: true,
}

export const MOCK_EVENTOS = [
  {
    id: 1,
    titulo: 'VII Congreso  de Ingeniería informatica',
    descripcion: 'El encuentro más importante del año. Paneles, talleres y networking con profesionales del sector.',
    fecha_inicio: '2024-10-15T09:00:00',
    fecha_fin: '2024-10-15T18:00:00',
    lugar: 'Aula Magna - Facultad de Ingeniería',
    tipo: 'congreso',
    imagen_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    publicado: true,
    cupo_maximo: 200,
    inscripciones_abiertas: false,
  },
  {
    id: 2,
    titulo: 'Taller de Gestión de Proyectos Ágiles',
    descripcion: 'Aprende Scrum y Kanban aplicados a proyectos de ingeniería.',
    fecha_inicio: '2024-09-20T14:00:00',
    fecha_fin: '2024-09-20T18:00:00',
    lugar: 'Sala de Conferencias B',
    tipo: 'taller',
    imagen_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    publicado: true,
    cupo_maximo: 50,
    inscripciones_abiertas: false,
  },
  {
    id: 3,
    titulo: 'Feria de Empresas 2024',
    descripcion: 'Conectate con más de 30 empresas líderes en busca de pasantes y profesionales.',
    fecha_inicio: '2024-11-08T10:00:00',
    fecha_fin: '2024-11-08T17:00:00',
    lugar: 'Hall Central - Pabellón informatica',
    tipo: 'feria',
    imagen_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    publicado: true,
    cupo_maximo: 500,
    inscripciones_abiertas: true,
  },
  {
    id: 4,
    titulo: 'Asamblea General Ordinaria',
    descripcion: 'Elección de autoridades y presentación del balance anual de ADEII.',
    fecha_inicio: '2024-08-18T18:00:00',
    fecha_fin: '2024-08-18T21:00:00',
    lugar: 'Aula 101',
    tipo: 'asamblea',
    imagen_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    publicado: true,
    cupo_maximo: null,
    inscripciones_abiertas: false,
  },
  {
    id: 5,
    titulo: 'Hackathon de Optimización informatica',
    descripcion: 'Resolvé problemas reales de la industria en 24 horas. Equipos de hasta 4 personas.',
    fecha_inicio: '2024-12-06T08:00:00',
    fecha_fin: '2024-12-07T09:00:00',
    lugar: 'Laboratorio de Informática',
    tipo: 'hackathon',
    imagen_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    publicado: true,
    cupo_maximo: 80,
    inscripciones_abiertas: true,
  },
]

export const MOCK_DOCUMENTOS = [
  {
    id: 1,
    titulo: 'Resumen Investigación Operativa - Unidad 1 y 2',
    descripcion: 'Resumen completo de programación lineal y simplex con ejercicios resueltos.',
    archivo_url: null,
    estado: 'aprobado',
    fecha_subida: '2024-09-01T10:00:00',
    carreras: { id: 1, nombre: 'Ingeniería informatica', codigo: 'II' },
    materias: { id: 1, nombre: 'Investigación Operativa', codigo: 'IO', anio: 3, cuatrimestre: 1 },
    usuarios: { id: 'demo', nombre: 'María', apellido: 'González' },
  },
  {
    id: 2,
    titulo: 'Formulario Estadística para Ingenieros',
    descripcion: 'Fórmulas esenciales de probabilidad y estadística descriptiva e inferencial.',
    archivo_url: null,
    estado: 'aprobado',
    fecha_subida: '2024-08-15T14:30:00',
    carreras: { id: 1, nombre: 'Ingeniería informatica', codigo: 'II' },
    materias: { id: 2, nombre: 'Estadística', codigo: 'EST', anio: 2, cuatrimestre: 2 },
    usuarios: { id: 'demo', nombre: 'Carlos', apellido: 'Ramírez' },
  },
  {
    id: 3,
    titulo: 'Guía de Procesos informaticaes - Unidad 3',
    descripcion: 'Descripción de los principales procesos de manufactura y producción.',
    archivo_url: null,
    estado: 'aprobado',
    fecha_subida: '2024-07-20T09:00:00',
    carreras: { id: 1, nombre: 'Ingeniería informatica', codigo: 'II' },
    materias: { id: 3, nombre: 'Procesos informaticaes', codigo: 'PI', anio: 3, cuatrimestre: 2 },
    usuarios: { id: 'demo', nombre: 'Laura', apellido: 'Fernández' },
  },
]

export const MOCK_CARRERAS = [
  { id: 1, nombre: 'Ingeniería informatica', codigo: 'II' },
  { id: 2, nombre: 'Ingeniería en Alimentos', codigo: 'IA' },
]

export const MOCK_USUARIOS = [
  {
    id: 'admin-demo',
    nombre: 'Admin',
    apellido: 'ADEII',
    email: 'admin@adeii.com',
    lu: null,
    rol: 'admin',
    estado: 'activo',
    activo: true,
    created_at: '2024-01-01T00:00:00',
  },
  {
    id: 'estudiante-demo',
    nombre: 'Estudiante',
    apellido: 'Demo',
    email: 'estudiante@adeii.com',
    lu: '12345/6',
    rol: 'estudiante',
    estado: 'activo',
    activo: true,
    created_at: '2024-03-01T00:00:00',
  },
]

export const MOCK_PLAN_ESTUDIO = [
  { id: 1, materia: { nombre: 'Álgebra', anio: 1, cuatrimestre: 1 }, estado: 'aprobada', nota: 8 },
  { id: 2, materia: { nombre: 'Análisis Matemático I', anio: 1, cuatrimestre: 1 }, estado: 'aprobada', nota: 7 },
  { id: 3, materia: { nombre: 'Física I', anio: 1, cuatrimestre: 2 }, estado: 'aprobada', nota: 6 },
  { id: 4, materia: { nombre: 'Estadística', anio: 2, cuatrimestre: 1 }, estado: 'aprobada', nota: 9 },
  { id: 5, materia: { nombre: 'Investigación Operativa', anio: 3, cuatrimestre: 1 }, estado: 'cursando', nota: null },
  { id: 6, materia: { nombre: 'Procesos informaticaes', anio: 3, cuatrimestre: 2 }, estado: 'pendiente', nota: null },
]

export const MOCK_CERTIFICADO = {
  codigo: 'DEMO-2024-001',
  nombre_completo: 'Juan Pérez',
  evento: 'VII Congreso  de Ingeniería',
  fecha_emision: '2024-10-15',
  valido: true,
}
