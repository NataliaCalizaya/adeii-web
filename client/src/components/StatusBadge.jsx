/**
 * Badge de estado basado en valores de los enum de Supabase
 * Soporta: estado_documento, estado_materia, tipo_evento, estado_usuario
 */
const STATUS_MAP = {
  // estado_documento
  pendiente: { label: 'Pendiente', className: 'badge-pending' },
  aprobado:  { label: 'Aprobado',  className: 'badge-success' },
  rechazado: { label: 'Rechazado', className: 'badge-error' },
  // estado_materia
  cursando:  { label: 'Cursando',  className: 'badge-primary' },
  aprobada:  { label: 'Aprobada',  className: 'badge-success' },
  // tipo_evento
  academico:  { label: 'Académico',  className: 'badge-primary' },
  taller:     { label: 'Taller',     className: 'badge bg-purple-100 text-purple-800' },
  seminario:  { label: 'Seminario',  className: 'badge bg-indigo-100 text-indigo-800' },
  social:     { label: 'Social',     className: 'badge-warning' },
  otro:       { label: 'Otro',       className: 'badge-pending' },
  // estado_usuario
  activo:     { label: 'Activo',     className: 'badge-success' },
  inactivo:   { label: 'Inactivo',   className: 'badge-pending' },
  suspendido: { label: 'Suspendido', className: 'badge-error' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] ?? { label: status, className: 'badge-pending' }
  return <span className={config.className}>{config.label}</span>
}
