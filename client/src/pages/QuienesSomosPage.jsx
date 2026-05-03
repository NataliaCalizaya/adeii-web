import { useApp } from '../context/AppContext'
import { useFetch } from '../hooks/useFetch'
import { usuariosService } from '../services/usuariosService'
import { SkeletonCard } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'

export default function QuienesSomosPage() {
  const { asociacion } = useApp()
  const { data: comision, loading, error } = useFetch(usuariosService.getComision, [])

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative h-72 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80"
          alt="Asociación universitaria"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay" />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl font-bold font-public-sans mb-3">Quiénes Somos</h1>
          <p className="text-blue-100 text-lg">Conocé la historia y el equipo de ADEII</p>
        </div>
      </section>

      {/* ===== MISIÓN / VISIÓN / HISTORIA ===== */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="section-title">Nuestra Asociación</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                {asociacion?.quienes_somos ?? 'Somos la Asociación de Estudiantes de Ingeniería informatica, una organización estudiantil que representa y acompaña a los estudiantes en su trayectoria académica.'}
              </p>

              <div className="space-y-6">
                {asociacion?.mision && (
                  <div className="border-l-4 border-primary pl-5">
                    <h3 className="font-semibold text-base font-public-sans mb-1">Misión</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{asociacion.mision}</p>
                  </div>
                )}
                {asociacion?.vision && (
                  <div className="border-l-4 border-secondary pl-5">
                    <h3 className="font-semibold text-base font-public-sans mb-1">Visión</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{asociacion.vision}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Historia */}
            <div className="bg-surface-container rounded-xl p-8">
              <h3 className="text-xl font-bold font-public-sans mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historia
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {asociacion?.historia ?? 'La asociación fue fundada con el objetivo de acompañar a los estudiantes en su trayecto universitario, brindando recursos, actividades y representación estudiantil.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMISIÓN DIRECTIVA ===== */}
      <section className="bg-surface-container py-16">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Comisión Directiva</h2>
            <p className="section-subtitle">Las personas que trabajan por los estudiantes</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : comision && comision.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {comision.map((miembro) => (
                <div key={miembro.id} className="card text-center group hover:shadow-lg transition-shadow duration-200">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-surface-container-high">
                    {miembro.foto_perfil ? (
                      <img
                        src={miembro.foto_perfil}
                        alt={`${miembro.nombre} ${miembro.apellido}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold font-public-sans">
                        {miembro.nombre?.[0]}{miembro.apellido?.[0]}
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold font-public-sans text-sm">
                    {miembro.nombre} {miembro.apellido}
                  </h4>
                  <p className="text-xs text-primary font-semibold font-public-sans mt-1 tracking-wide uppercase">
                    {miembro.cargo}
                  </p>
                  {miembro.periodo && (
                    <p className="text-xs text-on-surface-variant mt-1">{miembro.periodo}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-on-surface-variant text-sm">
                La información de la comisión no está disponible.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      {(asociacion?.email_contacto || asociacion?.telefono) && (
        <section className="py-16">
          <div className="container-main">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="section-title">Contacto</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
                {asociacion.email_contacto && (
                  <a href={`mailto:${asociacion.email_contacto}`}
                    className="flex items-center gap-3 text-on-surface hover:text-primary transition-colors">
                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm">{asociacion.email_contacto}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
