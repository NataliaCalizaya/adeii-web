import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { asociacion } = useApp()

  return (
    <footer className="bg-[#1a1b1f] text-white mt-20">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Columna 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-primary rounded-brand flex items-center justify-center">
                <span className="font-bold text-sm font-public-sans">AE</span>
              </div>
              <span className="font-bold text-lg font-public-sans">
                {asociacion?.nombre ?? 'ADEII'}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {asociacion?.mision?.slice(0, 120) ?? 'Asociación de Estudiantes de Ingeniería informatica'}
              {asociacion?.mision?.length > 120 ? '...' : ''}
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="font-semibold text-sm font-public-sans uppercase tracking-wider text-gray-300 mb-4">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/quienes-somos', label: 'Quiénes Somos' },
                { to: '/eventos', label: 'Eventos' },
                { to: '/apuntes', label: 'Repositorio de Apuntes' },
                { to: '/validar-certificado', label: 'Validar Certificado' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="font-semibold text-sm font-public-sans uppercase tracking-wider text-gray-300 mb-4">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {asociacion?.email_contacto && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${asociacion.email_contacto}`} className="hover:text-primary transition-colors">
                    {asociacion.email_contacto}
                  </a>
                </li>
              )}
              {asociacion?.telefono && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{asociacion.telefono}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="divider !border-gray-700 mt-10" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ADEII. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Desarrollado con ♥ para la comunidad estudiantil
          </p>
        </div>
      </div>
    </footer>
  )
}
