import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { documentosService } from '../services/documentosService'
import { SkeletonCard } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import StatusBadge from '../components/StatusBadge'

export default function ApuntesPage() {
  const { data: carreras } = useFetch(documentosService.getCarreras, [])
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('')
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const { data: materias } = useFetch(
    () => carreraSeleccionada
      ? documentosService.getMateriasPorCarrera(Number(carreraSeleccionada))
      : Promise.resolve([]),
    [carreraSeleccionada]
  )

  const { data: documentos, loading, error } = useFetch(
    () => documentosService.getDocumentos({
      carreraId: carreraSeleccionada ? Number(carreraSeleccionada) : undefined,
      materiaId: materiaSeleccionada ? Number(materiaSeleccionada) : undefined,
    }),
    [carreraSeleccionada, materiaSeleccionada]
  )

  const documentosFiltrados = (documentos ?? []).filter((d) =>
    busqueda === '' ||
    d.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      {/* Hero */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80"
          alt="Repositorio de apuntes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay" />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl font-bold font-public-sans mb-2">Repositorio de Apuntes</h1>
          <p className="text-blue-100">Material de estudio de la comunidad estudiantil</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          {/* Filtros */}
          <div className="bg-white border border-outline-variant rounded-xl p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Buscar</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar por título o descripción..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Carrera</label>
                <select
                  className="form-select"
                  value={carreraSeleccionada}
                  onChange={(e) => {
                    setCarreraSeleccionada(e.target.value)
                    setMateriaSeleccionada('')
                  }}
                >
                  <option value="">Todas las carreras</option>
                  {(carreras ?? []).map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Materia</label>
                <select
                  className="form-select"
                  value={materiaSeleccionada}
                  onChange={(e) => setMateriaSeleccionada(e.target.value)}
                  disabled={!carreraSeleccionada}
                >
                  <option value="">Todas las materias</option>
                  {(materias ?? []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} {m.anio ? `(${m.anio}° año)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : documentosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No se encontraron documentos con ese criterio.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant mb-5">
                {documentosFiltrados.length} documento{documentosFiltrados.length !== 1 ? 's' : ''} encontrado{documentosFiltrados.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentosFiltrados.map((doc) => (
                  <div key={doc.id} className="card-hover flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 16h8v1H8v-1zm0-2h8v1H8v-1zm0-2h5v1H8v-1z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm font-public-sans line-clamp-2 leading-snug">
                          {doc.titulo}
                        </h3>
                      </div>
                    </div>

                    {doc.descripcion && (
                      <p className="text-xs text-on-surface-variant mb-3 leading-relaxed line-clamp-2">
                        {doc.descripcion}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {doc.carreras?.nombre && (
                        <span className="badge-primary">{doc.carreras.nombre}</span>
                      )}
                      {doc.materias?.nombre && (
                        <span className="badge bg-surface-container text-on-surface-variant">
                          {doc.materias.nombre}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="text-xs text-on-surface-variant mb-4">
                        Subido por: {doc.usuarios?.nombre} {doc.usuarios?.apellido}
                        {doc.fecha_subida && (
                          <span> · {new Date(doc.fecha_subida).toLocaleDateString('es-AR')}</span>
                        )}
                      </div>
                      {/* PDF desde Supabase Storage — URL pública */}
                      <a
                        href={doc.archivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm py-2 w-full text-center block"
                      >
                        Ver PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
