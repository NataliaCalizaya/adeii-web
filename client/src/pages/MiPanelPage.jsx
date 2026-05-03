import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useFetch } from '../hooks/useFetch'
import { planEstudioService } from '../services/usuariosService'
import { certificadosService, driveService } from '../services/talleresService'
import { SkeletonCard } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import StatusBadge from '../components/StatusBadge'

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0))
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

/** Ícono PDF */
function PdfIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21H17a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 17h6M9 13h6M9 9h2" />
    </svg>
  )
}

/** Sección de certificados de Google Drive */
function CertificadosDrive({ nombreCompleto }) {
  const [archivos, setArchivos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [archivosDrive, setArchivosDrive] = useState([])
  const [errDrive, setErrDrive] = useState(null)
  const [previewId, setPreviewId] = useState(null)

  // Buscar automáticamente por el nombre del alumno al cargar
  useEffect(() => {
    if (!nombreCompleto || nombreCompleto.trim().length < 2) return
    setBusqueda(nombreCompleto)
    handleBuscar(nombreCompleto)
  }, [nombreCompleto])

  const handleBuscar = async (termino) => {
    const q = (termino ?? busqueda).trim()
    if (q.length < 2) return
    setBuscando(true)
    setErrDrive(null)
    setArchivosDrive([])
    setPreviewId(null)
    try {
      const datos = await driveService.buscarCertificados(q)
      setArchivosDrive(datos)
    } catch (e) {
      setErrDrive(e.message)
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold font-public-sans mb-2">Mis Certificados (Google Drive)</h2>
      <p className="text-sm text-on-surface-variant mb-4">
        Los certificados se buscan automáticamente en la carpeta oficial. Podés refinar la búsqueda si es necesario.
      </p>

      {/* Barra de búsqueda */}
      <div className="flex gap-2 mb-5">
        <input
          id="drive-buscar-nombre"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          placeholder="Buscar por nombre completo..."
          className="input flex-1"
        />
        <button
          id="drive-buscar-btn"
          onClick={() => handleBuscar()}
          disabled={buscando || busqueda.trim().length < 2}
          className="btn-primary"
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Error Drive */}
      {errDrive && (
        <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-300 mb-4">
          {errDrive}
        </div>
      )}

      {/* Skeleton */}
      {buscando && (
        <div className="space-y-3">
          {[1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Sin resultados */}
      {!buscando && !errDrive && archivosDrive.length === 0 && busqueda.trim().length >= 2 && (
        <div className="card text-center py-10 text-on-surface-variant">
          <div className="w-12 h-12 mx-auto mb-3 text-on-surface-variant opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm">No se encontraron certificados para <strong>"{busqueda}"</strong>.</p>
          <p className="text-xs mt-1 opacity-60">Probá con otra variación del nombre.</p>
        </div>
      )}

      {/* Listado de archivos */}
      {!buscando && archivosDrive.length > 0 && (
        <div className="space-y-3">
          {archivosDrive.map((archivo) => (
            <div key={archivo.id} className="card">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
                    <PdfIcon />
                  </div>
                  <div>
                    <p className="font-semibold text-sm font-public-sans">{archivo.nombre}</p>
                    {archivo.modificado && (
                      <p className="text-xs text-on-surface-variant">
                        {new Date(archivo.modificado).toLocaleDateString('es-AR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    id={`preview-btn-${archivo.id}`}
                    onClick={() => setPreviewId(previewId === archivo.id ? null : archivo.id)}
                    className="btn-ghost text-sm"
                  >
                    {previewId === archivo.id ? 'Cerrar' : 'Ver PDF'}
                  </button>
                  <a
                    id={`download-btn-${archivo.id}`}
                    href={archivo.descargarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    Descargar
                  </a>
                </div>
              </div>

              {/* Preview inline */}
              {previewId === archivo.id && (
                <div className="mt-4 rounded-xl overflow-hidden border border-outline-variant" style={{ height: '500px' }}>
                  <iframe
                    src={archivo.previewUrl}
                    width="100%"
                    height="100%"
                    title={archivo.nombre}
                    allow="autoplay"
                    className="block"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MiPanelPage() {
  const { user, profile, loading: authLoading } = useApp()

  const { data: planEstudio, loading: planLoading, error: planError } = useFetch(
    () => profile ? planEstudioService.getPlanEstudio(profile.id) : Promise.resolve([]),
    [profile?.id]
  )

  const { data: certificados, loading: certLoading } = useFetch(
    () => profile ? certificadosService.getCertificadosUsuario(profile.id) : Promise.resolve([]),
    [profile?.id]
  )

  if (authLoading) return <div className="py-20 text-center text-on-surface-variant">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />

  const materiasAprobadas = (planEstudio ?? []).filter((p) => p.estado === 'aprobada').length
  const totalMaterias = (planEstudio ?? []).length
  const progresoTotal = totalMaterias > 0 ? Math.round((materiasAprobadas / totalMaterias) * 100) : 0

  // Nombre completo para buscar en Drive
  const nombreCompleto = [profile?.nombre, profile?.apellido].filter(Boolean).join(' ')

  return (
    <div className="py-12">
      <div className="container-main">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-public-sans mb-1">Mi Panel</h1>
          <p className="text-on-surface-variant text-sm">
            Bienvenido/a, <span className="font-semibold">{profile?.nombre ?? user.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Perfil */}
          <div className="space-y-6">
            {/* Tarjeta de perfil */}
            <div className="card text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-surface-container-high">
                {profile?.foto_perfil ? (
                  <img
                    src={profile.foto_perfil}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold font-public-sans">
                    {profile?.nombre?.[0]}{profile?.apellido?.[0]}
                  </div>
                )}
              </div>
              <h2 className="font-bold font-public-sans text-lg">
                {profile?.nombre} {profile?.apellido}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">{profile?.email}</p>
              {profile?.lu && (
                <p className="text-xs text-on-surface-variant mt-1">LU: {profile.lu}</p>
              )}
              <StatusBadge status={profile?.estado ?? 'activo'} />
            </div>

            {/* Datos de carrera */}
            <div className="card">
              <h3 className="font-semibold font-public-sans text-sm mb-4 uppercase tracking-wider text-on-surface-variant">
                Carrera
              </h3>
              {profile?.carrera_principal ? (
                <div>
                  <p className="font-semibold text-sm">{profile.carrera_principal.nombre}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Carrera principal</p>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">Sin carrera asignada</p>
              )}
              {profile?.carrera_secundaria && (
                <div className="mt-3 pt-3 border-t border-outline-variant">
                  <p className="font-semibold text-sm">{profile.carrera_secundaria.nombre}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Carrera secundaria</p>
                </div>
              )}
            </div>

            {/* Progreso general */}
            <div className="card">
              <h3 className="font-semibold font-public-sans text-sm mb-4 uppercase tracking-wider text-on-surface-variant">
                Progreso académico
              </h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-primary font-public-sans">{progresoTotal}%</span>
                <span className="text-xs text-on-surface-variant">
                  {materiasAprobadas}/{totalMaterias} aprobadas
                </span>
              </div>
              <ProgressBar value={progresoTotal} />
            </div>
          </div>

          {/* Columna derecha: Plan de estudio + Certificados */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plan de estudio */}
            <div>
              <h2 className="text-xl font-bold font-public-sans mb-5">Plan de Estudio</h2>
              {planLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : planError ? (
                <ErrorMessage message={planError} />
              ) : !planEstudio || planEstudio.length === 0 ? (
                <div className="card text-center py-10 text-on-surface-variant">
                  <p className="text-sm">No hay materias registradas en tu plan de estudio.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-outline-variant">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-header text-left">Materia</th>
                        <th className="table-header text-center">Año</th>
                        <th className="table-header text-center">Cuatr.</th>
                        <th className="table-header text-center">Estado</th>
                        <th className="table-header text-center">Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planEstudio.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'table-row-even' : ''}>
                          <td className="table-cell font-medium">{item.materias?.nombre ?? '—'}</td>
                          <td className="table-cell text-center">{item.materias?.anio ?? '—'}</td>
                          <td className="table-cell text-center">{item.materias?.cuatrimestre ?? '—'}</td>
                          <td className="table-cell text-center">
                            <StatusBadge status={item.estado} />
                          </td>
                          <td className="table-cell text-center font-semibold font-public-sans">
                            {item.nota_final ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Certificados de Google Drive */}
            {nombreCompleto ? (
              <CertificadosDrive nombreCompleto={nombreCompleto} />
            ) : (
              <div className="card text-center py-10 text-on-surface-variant">
                <p className="text-sm">Completá tu perfil (nombre y apellido) para ver tus certificados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
