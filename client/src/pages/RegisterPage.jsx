import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [carreras, setCarreras] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    passwordConfirm: '',
    lu: '',
    fecha_inscripcion: '',
    carrera_principal_id: '',
    carrera_secundaria_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Cargar carreras para los selects
  useEffect(() => {
    fetch('/api/carreras')
      .then((r) => r.json())
      .then((res) => { if (res.ok) setCarreras(res.data ?? []) })
      .catch(() => {}) // no crítico si falla
  }, [])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.passwordConfirm) {
      return setError('Las contraseñas no coinciden.')
    }
    if (form.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.')
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
          lu: form.lu || null,
          fecha_inscripcion: form.fecha_inscripcion || null,
          carrera_principal_id: form.carrera_principal_id || null,
          carrera_secundaria_id: form.carrera_secundaria_id || null,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error al crear la cuenta.')
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold font-public-sans mb-2">¡Cuenta creada!</h2>
          <p className="text-on-surface-variant text-sm">
            Tu cuenta fue creada exitosamente. Redirigiendo al login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low py-12 px-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl font-public-sans">AE</span>
          </div>
          <h1 className="text-2xl font-bold font-public-sans mb-1">Crear cuenta en ADEII</h1>
          <p className="text-sm text-on-surface-variant">Ingresá como estudiante al portal de la asociación</p>
        </div>

        {/* Card */}
        <div className="card shadow-md">

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-brand px-4 py-3 text-sm text-red-800 mb-5 fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="form-label">Nombre <span className="text-error">*</span></label>
                <input
                  id="nombre"
                  type="text"
                  className="form-input"
                  placeholder="Juan"
                  value={form.nombre}
                  onChange={set('nombre')}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="apellido" className="form-label">Apellido <span className="text-error">*</span></label>
                <input
                  id="apellido"
                  type="text"
                  className="form-input"
                  placeholder="Pérez"
                  value={form.apellido}
                  onChange={set('apellido')}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Correo electrónico <span className="text-error">*</span></label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="tucorreo@uba.ar"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="form-label">Contraseña <span className="text-error">*</span></label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Mín. 6 caracteres"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
              <div>
                <label htmlFor="passwordConfirm" className="form-label">Repetir contraseña <span className="text-error">*</span></label>
                <input
                  id="passwordConfirm"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.passwordConfirm}
                  onChange={set('passwordConfirm')}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Libreta Universitaria */}
            <div>
              <label htmlFor="lu" className="form-label">Libreta Universitaria (LU)</label>
              <input
                id="lu"
                type="text"
                className="form-input"
                placeholder="Ej: 987/23"
                value={form.lu}
                onChange={set('lu')}
              />
            </div>

            {/* Fecha de inscripción */}
            <div>
              <label htmlFor="fecha_inscripcion" className="form-label">Fecha de inscripción a la carrera</label>
              <input
                id="fecha_inscripcion"
                type="date"
                className="form-input"
                value={form.fecha_inscripcion}
                onChange={set('fecha_inscripcion')}
              />
            </div>

            {/* Carreras */}
            <div>
              <label htmlFor="carrera_principal_id" className="form-label">Carrera principal</label>
              <select
                id="carrera_principal_id"
                className="form-input"
                value={form.carrera_principal_id}
                onChange={set('carrera_principal_id')}
              >
                <option value="">— Seleccioná tu carrera —</option>
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="carrera_secundaria_id" className="form-label">Carrera secundaria <span className="text-on-surface-variant text-xs">(opcional)</span></label>
              <select
                id="carrera_secundaria_id"
                className="form-input"
                value={form.carrera_secundaria_id}
                onChange={set('carrera_secundaria_id')}
              >
                <option value="">— Ninguna —</option>
                {carreras
                  .filter((c) => c.id !== form.carrera_principal_id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))
                }
              </select>
            </div>

            {/* Rol informativo */}
            <div className="flex items-center gap-2 bg-surface-container px-4 py-3 rounded-brand">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
              </svg>
              <p className="text-xs text-on-surface-variant">
                Las cuentas creadas desde este formulario reciben el rol de <strong>Estudiante</strong> por defecto.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : 'Crear cuenta'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-on-surface-variant mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Ingresar
          </Link>
        </p>
        <div className="text-center mt-3">
          <Link to="/" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
