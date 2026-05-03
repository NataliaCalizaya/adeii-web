import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { profile: loggedProfile } = await login(form.email, form.password)
      // Redirigir según rol — el perfil ya está disponible sincrónicamente
      navigate(loggedProfile?.rol === 'admin' ? '/admin' : '/mi-panel')
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos. Verificá tus datos.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-container-low py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl font-public-sans">AE</span>
          </div>
          <h1 className="text-2xl font-bold font-public-sans mb-1">Ingresar a ADEII</h1>
          <p className="text-sm text-on-surface-variant">Portal de la Asociación de estudiantes de Ingenieria informatica </p>
        </div>

        {/* Card */}
        <div className="card shadow-md">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-brand px-4 py-3 text-sm text-red-800 mb-5 fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="tucorreo@uba.ar"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Ingresando...
                </span>
              ) : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Crear cuenta
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
