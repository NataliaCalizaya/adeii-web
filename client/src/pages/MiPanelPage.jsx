import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useFetch } from '../hooks/useFetch'
import { planEstudioService } from '../services/usuariosService'
import { certificadosService } from '../services/talleresService'
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
              {profile?.en_comision && (
                <div className="mt-3">
                  <span className="badge-primary">{profile.cargo ?? 'Comisión'}</span>
                </div>
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

            {/* Mis certificados */}
            <div>
              <h2 className="text-xl font-bold font-public-sans mb-5">Mis Certificados</h2>
              {certLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : !certificados || certificados.length === 0 ? (
                <div className="card text-center py-10 text-on-surface-variant">
                  <p className="text-sm">Todavía no tenés certificados emitidos.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {certificados.map((cert) => (
                    <div key={cert.id} className="card flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-sm font-public-sans">{cert.talleres?.nombre}</p>
                          <p className="text-xs text-on-surface-variant font-mono">{cert.codigo_validacion}</p>
                          {cert.fecha_emision && (
                            <p className="text-xs text-on-surface-variant">
                              {new Date(cert.fecha_emision).toLocaleDateString('es-AR')}
                            </p>
                          )}
                        </div>
                      </div>
                      {cert.archivo_url && (
                        <a
                          href={cert.archivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-sm flex-shrink-0"
                        >
                          Ver PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
