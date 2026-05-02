import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useFetch } from '../hooks/useFetch'
import { supabase } from '../services/supabaseClient'
import { SkeletonCard } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import StatusBadge from '../components/StatusBadge'

export default function AdminPage() {
  const { user, profile, loading: authLoading, profileLoading } = useApp()

  const { data: usuarios, loading: usersLoading, error: usersError } = useFetch(
    () => supabase.from('usuarios').select('id, nombre, apellido, email, lu, rol, estado, activo, created_at').order('created_at', { ascending: false }).then(({ data, error }) => { if (error) throw error; return data }),
    []
  )

  const { data: documentosPendientes, loading: docsLoading } = useFetch(
    () => supabase.from('documentos')
      .select('id, titulo, estado, fecha_subida, carreras(nombre), usuarios!documentos_subido_por_fkey(nombre, apellido)')
      .eq('estado', 'pendiente')
      .order('fecha_subida')
      .then(({ data, error }) => { if (error) throw error; return data }),
    []
  )

  if (authLoading || profileLoading) return <div className="py-20 text-center text-on-surface-variant">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (profile?.rol !== 'admin') return <Navigate to="/mi-panel" replace />

  return (
    <div className="py-12">
      <div className="container-main">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-public-sans mb-1">Panel Administrativo</h1>
          <p className="text-on-surface-variant text-sm">
            Gestión de usuarios, documentos y contenido de ADEII
          </p>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Usuarios', value: usuarios?.length ?? '—', icon: '👥', color: 'bg-blue-50 text-blue-700' },
            { label: 'Docs pendientes', value: documentosPendientes?.length ?? '—', icon: '📄', color: 'bg-yellow-50 text-yellow-700' },
          ].map((stat) => (
            <div key={stat.label} className={`card flex items-center gap-4 ${stat.color}`}>
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold font-public-sans">{stat.value}</div>
                <div className="text-xs font-public-sans font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Tabla de usuarios */}
          <div>
            <h2 className="text-xl font-bold font-public-sans mb-5">Usuarios</h2>
            {usersLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
            ) : usersError ? (
              <ErrorMessage message={usersError} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-outline-variant">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header text-left">Nombre</th>
                      <th className="table-header text-left">Email</th>
                      <th className="table-header text-center">Rol</th>
                      <th className="table-header text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(usuarios ?? []).map((u, idx) => (
                      <tr key={u.id} className={idx % 2 === 0 ? 'table-row-even' : ''}>
                        <td className="table-cell font-medium text-sm">
                          {u.nombre} {u.apellido}
                        </td>
                        <td className="table-cell text-xs text-on-surface-variant">{u.email}</td>
                        <td className="table-cell text-center">
                          <span className={u.rol === 'admin' ? 'badge-primary' : 'badge-pending'}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="table-cell text-center">
                          <StatusBadge status={u.estado ?? 'activo'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Documentos pendientes */}
          <div>
            <h2 className="text-xl font-bold font-public-sans mb-5">Documentos Pendientes</h2>
            {docsLoading ? (
              <div className="space-y-2">{[1,2].map(i => <SkeletonCard key={i} />)}</div>
            ) : !documentosPendientes || documentosPendientes.length === 0 ? (
              <div className="card text-center py-10 text-on-surface-variant">
                <p className="text-sm">No hay documentos pendientes de revisión. ✅</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documentosPendientes.map((doc) => (
                  <div key={doc.id} className="card flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm font-public-sans">{doc.titulo}</p>
                      <p className="text-xs text-on-surface-variant">
                        {doc.usuarios?.nombre} {doc.usuarios?.apellido}
                        {doc.carreras?.nombre && ` · ${doc.carreras.nombre}`}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {doc.fecha_subida && new Date(doc.fecha_subida).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => approveDoc(doc.id)}
                        className="btn-ghost text-xs !text-green-700 hover:!bg-green-50"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => rejectDoc(doc.id)}
                        className="btn-ghost text-xs !text-error hover:!bg-red-50"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  async function approveDoc(id) {
    await supabase.from('documentos').update({ estado: 'aprobado', aprobado_por: profile.id, fecha_aprobacion: new Date().toISOString() }).eq('id', id)
    window.location.reload()
  }

  async function rejectDoc(id) {
    await supabase.from('documentos').update({ estado: 'rechazado' }).eq('id', id)
    window.location.reload()
  }
}
