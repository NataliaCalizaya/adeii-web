import { useState } from 'react'
import { certificadosService } from '../services/talleresService'

export default function ValidarCertificadoPage() {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState(null)
  const [buscado, setBuscado] = useState(false)

  const handleValidar = async (e) => {
    e.preventDefault()
    if (!codigo.trim()) return
    setBuscando(true)
    setError(null)
    setResultado(null)
    setBuscado(false)
    try {
      const data = await certificadosService.validarCertificado(codigo.trim())
      setResultado(data)
      setBuscado(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBuscando(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&q=80"
          alt="Validación de certificados"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay" />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl font-bold font-public-sans mb-2">Validación de Certificados</h1>
          <p className="text-blue-100">Verificá la autenticidad de certificados emitidos por ADEII</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-main max-w-2xl">
          {/* Formulario de búsqueda */}
          <div className="card shadow-md mb-8">
            <h2 className="text-xl font-bold font-public-sans mb-2">Ingresar Código de Validación</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              Ingresá el código único que figura en el certificado para verificar su autenticidad.
            </p>
            <form onSubmit={handleValidar}>
              <div className="mb-4">
                <label className="form-label">Código de validación</label>
                <input
                  type="text"
                  className="form-input font-mono text-base tracking-widest"
                  placeholder="Ej: ADEII-2024-XXXXX"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  required
                  maxLength={60}
                />
              </div>
              <button
                type="submit"
                disabled={buscando || !codigo.trim()}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {buscando ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Validando...
                  </span>
                ) : 'Validar Certificado'}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 fade-in">
              {error}
            </div>
          )}

          {/* Resultado: no encontrado */}
          {buscado && !resultado && !error && (
            <div className="card text-center py-10 fade-in">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-public-sans text-error mb-2">Certificado no encontrado</h3>
              <p className="text-sm text-on-surface-variant">
                El código <code className="bg-surface-container px-2 py-0.5 rounded font-mono">{codigo}</code> no
                corresponde a ningún certificado emitido por ADEII.
              </p>
            </div>
          )}

          {/* Resultado: encontrado */}
          {resultado && (
            <div className="card border-2 border-green-400 shadow-lg fade-in">
              {/* Encabezado */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-outline-variant">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-green-800 font-public-sans">Certificado Válido</h3>
                  <p className="text-xs text-green-600">Verificado por ADEII</p>
                </div>
              </div>

              {/* Detalles */}
              <dl className="space-y-4">
                <div>
                  <dt className="form-label">Titular</dt>
                  <dd className="text-base font-semibold font-public-sans">
                    {resultado.usuarios?.nombre} {resultado.usuarios?.apellido}
                  </dd>
                </div>
                <div>
                  <dt className="form-label">Taller / Actividad</dt>
                  <dd className="text-base">{resultado.talleres?.nombre}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="form-label">Fecha de Emisión</dt>
                    <dd className="text-sm">
                      {resultado.fecha_emision
                        ? new Date(resultado.fecha_emision).toLocaleDateString('es-AR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="form-label">Código</dt>
                    <dd className="text-sm font-mono text-on-surface-variant">
                      {resultado.codigo_validacion}
                    </dd>
                  </div>
                </div>
              </dl>

              {/* PDF desde Supabase Storage */}
              {resultado.archivo_url && (
                <div className="mt-6 pt-5 border-t border-outline-variant">
                  <a
                    href={resultado.archivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar Certificado PDF
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="mt-8 p-5 bg-surface-container rounded-xl">
            <h4 className="font-semibold text-sm font-public-sans mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ¿Cómo funciona?
            </h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Cada certificado emitido por ADEII tiene un código único de validación. 
              Ingresá ese código para verificar que el certificado es auténtico y fue emitido 
              por nuestra asociación.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
