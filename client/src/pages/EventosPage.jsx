import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { eventosService } from '../services/eventosService'
import { useApp } from '../context/AppContext'
import { SkeletonCard } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import StatusBadge from '../components/StatusBadge'

const TIPOS = ['todos', 'academico', 'taller', 'seminario', 'social', 'otro']

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function EventosPage() {
  const { user, profile } = useApp()
  const { data: eventos, loading, error, setData } = useFetch(eventosService.getEventos, [])
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [inscribiendoId, setInscribiendoId] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const eventosFiltrados = filtroTipo === 'todos'
    ? (eventos ?? [])
    : (eventos ?? []).filter((e) => e.tipo === filtroTipo)

  const handleInscribir = async (eventoId) => {
    if (!user || !profile) {
      setMensaje({ tipo: 'error', texto: 'Debés iniciar sesión para inscribirte.' })
      return
    }
    setInscribiendoId(eventoId)
    try {
      await eventosService.inscribirUsuario(profile.id, eventoId)
      setMensaje({ tipo: 'success', texto: '¡Inscripción realizada con éxito!' })
    } catch (err) {
      if (err.code === '23505') {
        setMensaje({ tipo: 'warning', texto: 'Ya estás inscripto en este evento.' })
      } else {
        setMensaje({ tipo: 'error', texto: err.message })
      }
    } finally {
      setInscribiendoId(null)
      setTimeout(() => setMensaje(null), 4000)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"
          alt="Eventos y galería"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay" />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl font-bold font-public-sans mb-2">Galería y Eventos</h1>
          <p className="text-blue-100">Actividades organizadas por la asociación</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TIPOS.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold font-public-sans transition-all duration-200 capitalize ${
                  filtroTipo === tipo
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tipo === 'todos' ? 'Todos' : tipo}
              </button>
            ))}
          </div>

          {/* Mensaje flash */}
          {mensaje && (
            <div className={`mb-6 px-4 py-3 rounded-brand text-sm font-public-sans fade-in border ${
              mensaje.tipo === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              mensaje.tipo === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              {mensaje.texto}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : eventosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No hay eventos disponibles para este filtro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosFiltrados.map((evento) => (
                <div key={evento.id} className="card-hover flex flex-col overflow-hidden">
                  {evento.imagen ? (
                    <img
                      src={evento.imagen}
                      alt={evento.titulo}
                      className="w-full h-44 object-cover -mx-6 -mt-6 mb-5 w-[calc(100%+3rem)]"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div className="h-44 -mx-6 -mt-6 mb-5 bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center">
                      <svg className="w-10 h-10 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col">
                    <StatusBadge status={evento.tipo} />
                    <h3 className="text-base font-semibold font-public-sans mt-2 mb-1 line-clamp-2">
                      {evento.titulo}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-1">
                      📅 {formatDate(evento.fecha_inicio)}
                    </p>
                    {evento.lugar && (
                      <p className="text-xs text-on-surface-variant mb-3">📍 {evento.lugar}</p>
                    )}
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 flex-1 mb-5">
                      {evento.descripcion}
                    </p>
                    <button
                      onClick={() => handleInscribir(evento.id)}
                      disabled={inscribiendoId === evento.id}
                      className="btn-primary text-sm py-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {inscribiendoId === evento.id ? 'Inscribiendo...' : 'Inscribirme'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
