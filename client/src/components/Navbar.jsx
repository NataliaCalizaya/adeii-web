import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { user, profile, logout } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/quienes-somos', label: 'Quiénes Somos' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/galeria', label: 'Galería' },
    ...(user ? [{ to: '/apuntes', label: 'Apuntes' }] : []),
    { to: '/validar-certificado', label: 'Certificados' },
  ]

  return (
    <nav className="navbar">
      <div className="container-main h-full flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setMenuOpen(false)}>
          <div className="w-9 h-9 bg-white rounded-brand flex items-center justify-center shadow-sm">
            <span className="text-primary font-bold text-sm font-public-sans">AE</span>
          </div>
          <span className="text-white font-bold text-lg hidden sm:block font-public-sans tracking-tight">
            ADEII
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth zone */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-white bg-opacity-15 hover:bg-opacity-25 text-white px-3 py-1.5 rounded-brand transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-white font-public-sans">
                  {profile?.nombre?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                </div>
                <span className="text-sm font-public-sans font-medium">
                  {profile?.nombre ?? 'Mi cuenta'}
                </span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-outline-variant z-50 py-1 fade-in">
                  <Link
                    to="/mi-panel"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors font-public-sans"
                  >
                    Mi Panel
                  </Link>
                  {profile?.rol === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors font-public-sans"
                    >
                      Panel Administrativo
                    </Link>
                  )}
                  <hr className="my-1 border-outline-variant" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 transition-colors font-public-sans"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary text-sm py-1.5 px-4">
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-brand hover:bg-white hover:bg-opacity-20 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white border-opacity-20 fade-in">
          <ul className="container-main py-3 flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-brand text-white text-sm font-public-sans font-medium transition-colors ${isActive ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link to="/mi-panel" onClick={() => setMenuOpen(false)} className="block py-2 px-3 text-white text-sm font-public-sans hover:bg-white hover:bg-opacity-10 rounded-brand">
                    Mi Panel
                  </Link>
                </li>
                <li>
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="w-full text-left py-2 px-3 text-red-300 text-sm font-public-sans hover:bg-white hover:bg-opacity-10 rounded-brand">
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 px-3 text-white text-sm font-public-sans font-semibold hover:bg-white hover:bg-opacity-10 rounded-brand">
                  Ingresar
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}
