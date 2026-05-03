import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useFetch } from '../hooks/useFetch'
import { eventosService } from '../services/eventosService'
import { documentosService } from '../services/documentosService'

// ─── Iconos SVG equivalentes a Material Symbols ───────────────────────────────
const IconArrow = () => (
  <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)
const IconPdf = () => (
  <svg className="w-10 h-10 text-[#ba1a1a]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 16h8v1H8v-1zm0-2h8v1H8v-1zm0-2h5v1H8v-1z" />
  </svg>
)
const IconLock = () => (
  <svg className="w-10 h-10 text-[#146ead]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)
const IconFlag = () => (
  <svg className="w-10 h-10 text-[#146ead]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V5m0 0l9-2 9 2v10l-9-2-9 2V5z" />
  </svg>
)
const IconEye = () => (
  <svg className="w-10 h-10 text-[#146ead]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)
const IconChevLeft = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)
const IconChevRight = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// ─── Mini Calendar ─────────────────────────────────────────────────────────────
const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function MiniCalendar({ eventos = [] }) {
  const [current, setCurrent] = useState(new Date())
  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Monday-based offset (getDay: 0=Sun → offset 6, 1=Mon → 0, ...)
  let offset = firstDay.getDay() - 1
  if (offset < 0) offset = 6

  const today = new Date()

  // Build event day map from real Supabase data
  const eventMap = {}
  eventos.forEach((ev) => {
    if (!ev.fecha_inicio) return
    const d = new Date(ev.fecha_inicio)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventMap[day]) eventMap[day] = []
      eventMap[day].push(ev.tipo ?? 'otro')
    }
  })

  const isToday = (day) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

  const isWeekend = (slotIdx) => slotIdx % 7 >= 5

  const slots = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const monthLabel = current
    .toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase())

  return (
    <div className="bg-white border border-[#c0c7d1] rounded p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[24px] font-semibold leading-[1.3] text-[#1a1b1f]">
          Calendario de Actividades
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent(new Date(year, month - 1, 1))}
            className="p-1 hover:bg-[#eeedf3] rounded transition-colors text-[#404750]"
          >
            <IconChevLeft />
          </button>
          <span className="text-[14px] font-semibold tracking-[0.05em] text-[#1a1b1f] min-w-[140px] text-center">
            {monthLabel}
          </span>
          <button
            onClick={() => setCurrent(new Date(year, month + 1, 1))}
            className="p-1 hover:bg-[#eeedf3] rounded transition-colors text-[#404750]"
          >
            <IconChevRight />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[14px] font-semibold tracking-[0.05em] text-[#404750] mb-2">
        {WEEK_DAYS.map((d) => <div key={d}>{d}</div>)}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {slots.map((day, idx) =>
          day === null ? (
            <div key={`e-${idx}`} className="p-2 h-16 border border-transparent" />
          ) : (
            <div
              key={day}
              className={[
                'p-2 h-16 border rounded flex flex-col justify-between transition-colors',
                isToday(day)
                  ? 'border-[#00558a] bg-[#00558a]/5'
                  : eventMap[day]
                    ? 'border-[#e3e2e7] bg-[#cfe5ff]/20'
                    : 'border-[#e3e2e7]',
                isWeekend(idx) && !isToday(day) ? 'bg-[#eeedf3]' : '',
                !isToday(day) && !isWeekend(idx) ? 'hover:bg-[#f4f3f8]' : '',
              ].join(' ')}
            >
              <span
                className={`text-[16px] leading-[1.6] ${isToday(day)
                  ? 'text-[#00558a] font-bold'
                  : isWeekend(idx)
                    ? 'text-[#404750]'
                    : 'text-[#1a1b1f]'
                  }`}
              >
                {day}
              </span>
              {eventMap[day] && (
                <div className="flex gap-1 flex-wrap">
                  {eventMap[day].some((t) => t === 'academico') && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00558a]" />
                  )}
                  {eventMap[day].some((t) => t === 'taller') && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#944a00]" />
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-[12px] leading-[1.4] text-[#404750]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#00558a]" /> Académico
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#944a00]" /> Talleres
        </div>
      </div>
    </div>
  )
}

// ─── Badge de novedad ──────────────────────────────────────────────────────────
const BADGE_MAP = {
  academico: { label: 'Académico', bg: 'bg-[#cfe5ff]', text: 'text-[#004a79]' },
  taller: { label: 'Capacitación', bg: 'bg-[#ffdcc5]', text: 'text-[#713700]' },
  seminario: { label: 'Seminario', bg: 'bg-[#e4e2e2]', text: 'text-[#464747]' },
  social: { label: 'Social', bg: 'bg-[#ffdcc5]', text: 'text-[#713700]' },
  otro: { label: 'General', bg: 'bg-[#e4e2e2]', text: 'text-[#464747]' },
}

// ─── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { asociacion } = useApp()
  const { data: eventos } = useFetch(eventosService.getEventos, [])
  const { data: documentos } = useFetch(documentosService.getDocumentos, [])

  const novedades = (eventos ?? []).slice(0, 3)
  const pdfs = (documentos ?? []).slice(0, 3)

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative w-full h-[600px] flex items-center justify-center bg-[#2f3034]">
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="Universidad"
            src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-[1200px] mx-auto">
          <h1
            className="text-[48px] font-bold leading-[1.1] tracking-[-0.02em] text-white mb-6"
            style={{ fontFamily: "'Slabo 27px', serif" }}
          >
            {asociacion?.nombre ?? 'Asociación de estudiantes de Ingenieria informatica  '}
          </h1>
          <p
            className="text-[18px] leading-[1.6] text-white/90 max-w-2xl mx-auto"
            style={{ fontFamily: "'Slabo 27px', serif" }}
          >
            Impulsando el futuro de los estudiantes de ingeniería mediante recursos, apoyo institucional y comunidad.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 py-20 space-y-20">

        {/* ── 1. CALENDARIO ───────────────────────────── */}
        <section>
          <MiniCalendar eventos={eventos ?? []} />
        </section>

        {/* ── 2. REPOSITORIO DIGITAL ───────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-[#e3e2e7] pb-4">
            <h2
              className="text-[24px] font-semibold leading-[1.3] text-[#1a1b1f]"
              style={{ fontFamily: "'Slabo 27px', serif" }}
            >
              Repositorio Digital
            </h2>
            <Link
              to="/apuntes"
              className="text-[14px] font-semibold tracking-[0.05em] text-[#00558a] hover:underline flex items-center gap-1"
            >
              Ver todos <IconArrow />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* PDF cards from Supabase */}
            {pdfs.length > 0
              ? pdfs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-[#c0c7d1] rounded p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center"
                >
                  <IconPdf />
                  <h3
                    className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] my-6"
                    style={{ fontFamily: "'Slabo 27px', serif" }}
                  >
                    {doc.titulo}
                  </h3>
                  <a
                    href={doc.archivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto px-6 py-2 border border-[#146ead] text-[#146ead] rounded hover:bg-[#146ead]/5 transition-colors text-[14px] font-semibold w-full text-center"
                  >
                    Ver
                  </a>
                </div>
              ))
              : /* Placeholder cards cuando no hay datos */
              ['Análisis Matemático II', 'Física I', 'Programación'].map((nombre) => (
                <div
                  key={nombre}
                  className="bg-white border border-[#c0c7d1] rounded p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center"
                >
                  <IconPdf />
                  <h3
                    className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] my-6"
                    style={{ fontFamily: "'Slabo 27px', serif" }}
                  >
                    {nombre}
                  </h3>
                  <button className="mt-auto px-6 py-2 border border-[#146ead] text-[#146ead] rounded hover:bg-[#146ead]/5 transition-colors text-[14px] font-semibold w-full">
                    Ver
                  </button>
                </div>
              ))}

            {/* CTA card: login */}
            <div className="bg-white border-2 border-[#146ead] rounded p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
              <IconLock />
              <p
                className="text-[16px] leading-[1.6] text-[#404750] my-6"
                style={{ fontFamily: "'Slabo 27px', serif" }}
              >
                Iniciá sesión para acceder a todo el repositorio
              </p>
              <Link
                to="/login"
                className="mt-auto px-6 py-2 bg-[#146ead] text-white rounded hover:bg-[#146ead]/90 transition-colors text-[14px] font-semibold w-full text-center"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </section>

        {/* ── 3. VIDA UNIVERSITARIA ────────────────────── */}
        <section>
          <h2
            className="text-[24px] font-semibold leading-[1.3] text-[#1a1b1f] mb-6 text-center border-b border-[#e3e2e7] pb-4"
            style={{ fontFamily: "'Slabo 27px', serif" }}
          >
            Vida Universitaria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
                alt: 'Comunidad estudiantil',
                title: 'Comunidad',
                desc: 'Espacios de estudio y colaboración.',
              },
              {
                img: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80',
                alt: 'Taller técnico',
                title: 'Talleres Técnicos',
                desc: 'Formación complementaria en ingeniería.',
              },
              {
                img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
                alt: 'Eventos universitarios',
                title: 'Eventos Anuales',
                desc: 'Congresos y ferias de ciencias.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative group overflow-hidden rounded bg-white border border-[#c0c7d1] hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden bg-[#eeedf3]">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3
                    className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] mb-1"
                    style={{ fontFamily: "'Slabo 27px', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[16px] leading-[1.6] text-[#404750]"
                    style={{ fontFamily: "'Slabo 27px', serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. NOVEDADES INSTITUCIONALES ─────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-[#e3e2e7] pb-4">
            <h2
              className="text-[24px] font-semibold leading-[1.3] text-[#1a1b1f]"
              style={{ fontFamily: "'Slabo 27px', serif" }}
            >
              Novedades Institucionales
            </h2>
            <Link
              to="/eventos"
              className="text-[14px] font-semibold tracking-[0.05em] text-[#00558a] hover:underline flex items-center gap-1"
            >
              Ver todas <IconArrow />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {novedades.length > 0
              ? novedades.map((ev) => {
                const badge = BADGE_MAP[ev.tipo] ?? BADGE_MAP.otro
                return (
                  <article
                    key={ev.id}
                    className="bg-white border border-[#c0c7d1] rounded p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div
                      className={`inline-block px-2 py-1 ${badge.bg} ${badge.text} text-[12px] leading-[1.4] rounded mb-4 uppercase tracking-wider font-semibold`}
                      style={{ fontFamily: "'Slabo 27px', serif" }}
                    >
                      {badge.label}
                    </div>
                    <h3
                      className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] mb-2"
                      style={{ fontFamily: "'Slabo 27px', serif" }}
                    >
                      {ev.titulo}
                    </h3>
                    <p
                      className="text-[16px] leading-[1.6] text-[#404750] mb-4 line-clamp-3"
                      style={{ fontFamily: "'Slabo 27px', serif" }}
                    >
                      {ev.descripcion}
                    </p>
                    <Link
                      to="/eventos"
                      className="text-[14px] font-semibold tracking-[0.05em] text-[#00558a] hover:text-[#146ead] transition-colors"
                    >
                      Leer más
                    </Link>
                  </article>
                )
              })
              : /* Placeholder cards */
              [
                {
                  badge: BADGE_MAP.academico,
                  title: 'Nueva Beca Disponible',
                  desc: 'Se ha abierto la convocatoria para las becas de ayuda económica y apuntes correspondientes al segundo cuatrimestre.',
                },
                {
                  badge: BADGE_MAP.taller,
                  title: 'Taller de AutoCAD',
                  desc: 'Inscripciones abiertas para el taller nivel inicial y avanzado de diseño asistido por computadora.',
                },
                {
                  badge: BADGE_MAP.seminario,
                  title: 'Charla de Inteligencia Artificial',
                  desc: 'Expertos de la industria debatirán sobre el impacto de la IA en la ingeniería civil y de sistemas.',
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="bg-white border border-[#c0c7d1] rounded p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div
                    className={`inline-block px-2 py-1 ${item.badge.bg} ${item.badge.text} text-[12px] leading-[1.4] rounded mb-4 uppercase tracking-wider font-semibold`}
                  >
                    {item.badge.label}
                  </div>
                  <h3
                    className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] mb-2"
                    style={{ fontFamily: "'Slabo 27px', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[16px] leading-[1.6] text-[#404750] mb-4 line-clamp-3"
                    style={{ fontFamily: "'Slabo 27px', serif" }}
                  >
                    {item.desc}
                  </p>
                  <Link
                    to="/eventos"
                    className="text-[14px] font-semibold tracking-[0.05em] text-[#00558a] hover:text-[#146ead] transition-colors"
                  >
                    Leer más
                  </Link>
                </article>
              ))}
          </div>
        </section>

        {/* ── 5. QUIÉNES SOMOS ─────────────────────────── */}
        <section className="bg-[#f5f5f5] rounded-xl border border-[#c0c7d1] p-8 md:p-12">
          <h2
            className="text-[24px] font-semibold leading-[1.3] text-[#1a1b1f] text-center mb-8 border-b border-[#e3e2e7] pb-4"
            style={{ fontFamily: "'Slabo 27px', serif" }}
          >
            Quiénes Somos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
            {/* Misión */}
            <div className="flex flex-col items-center text-center">
              <IconFlag />
              <h3
                className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] mt-4 mb-3"
                style={{ fontFamily: "'Slabo 27px', serif" }}
              >
                Nuestra Misión
              </h3>
              <p
                className="text-[16px] leading-[1.6] text-[#404750] max-w-sm"
                style={{ fontFamily: "'Slabo 27px', serif" }}
              >
                {asociacion?.mision ??
                  'Promover el desarrollo integral de los estudiantes de ingeniería, brindando herramientas académicas y espacios de crecimiento que potencien su formación profesional y humana.'}
              </p>
            </div>

            {/* Visión */}
            <div className="flex flex-col items-center text-center">
              <IconEye />
              <h3
                className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] mt-4 mb-3"
                style={{ fontFamily: "'Slabo 27px', serif" }}
              >
                Nuestra Visión
              </h3>
              <p
                className="text-[16px] leading-[1.6] text-[#404750] max-w-sm"
                style={{ fontFamily: "'Slabo 27px', serif" }}
              >
                {asociacion?.vision ??
                  'Ser la Asociación de estudiantes de Ingenieria informatica  referente a nivel , reconocida por su excelencia institucional y su compromiso con la comunidad universitaria.'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/quienes-somos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#146ead] text-[#146ead] rounded hover:bg-[#146ead] hover:text-white transition-colors text-[14px] font-semibold tracking-[0.05em]"
              style={{ fontFamily: "'Slabo 27px', serif" }}
            >
              Conocé más sobre nosotros <IconArrow />
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
