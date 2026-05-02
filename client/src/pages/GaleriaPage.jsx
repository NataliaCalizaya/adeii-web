import { Link } from 'react-router-dom'

export default function GaleriaPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center bg-[#2f3034]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2000&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-[#1F2024] opacity-60"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-[48px] font-bold leading-[1.1] tracking-[-0.02em] font-public-sans mb-2">
            Galería & Eventos
          </h1>
          <p className="text-[18px] leading-[1.6] text-[#deecff] max-w-2xl mx-auto font-public-sans">
            Reviví los mejores momentos de nuestras conferencias, talleres y encuentros estudiantiles.
          </p>
        </div>
      </section>

      {/* Container */}
      <div className="max-w-[1200px] mx-auto px-6 py-20 space-y-20">
        {/* Past Events Section */}
        <section>
          <h2 className="text-[24px] font-semibold leading-[1.3] text-[#1a1b1f] font-public-sans mb-6 border-b border-[#e3e2e7] pb-1">
            Eventos Recientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event Card 1 */}
            <div className="bg-white border border-[#c0c7d1] rounded overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden relative">
                <img
                  alt="Congreso de Ingeniería"
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-[#00558a] text-white text-[12px] leading-[1.4] font-public-sans px-2 py-1 rounded uppercase tracking-wider">
                  Congreso
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-[#404750] text-[12px] leading-[1.4] font-public-sans mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  15 de Octubre, 2023
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] font-public-sans mb-2">
                  VII Congreso Regional de Ingeniería
                </h3>
                <a href="#" className="inline-flex items-center gap-1 text-[#00558a] text-[14px] font-semibold leading-[1.2] font-public-sans hover:text-[#004a79] transition-colors">
                  Ver fotos
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="bg-white border border-[#c0c7d1] rounded overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden relative">
                <img
                  alt="Taller de Robótica"
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-[#944a00] text-white text-[12px] leading-[1.4] font-public-sans px-2 py-1 rounded uppercase tracking-wider">
                  Taller
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-[#404750] text-[12px] leading-[1.4] font-public-sans mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  2 de Septiembre, 2023
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] font-public-sans mb-2">
                  Taller de Introducción a la Robótica
                </h3>
                <a href="#" className="inline-flex items-center gap-1 text-[#00558a] text-[14px] font-semibold leading-[1.2] font-public-sans hover:text-[#004a79] transition-colors">
                  Ver fotos
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="bg-white border border-[#c0c7d1] rounded overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden relative">
                <img
                  alt="Asamblea Estudiantil"
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-[#525252] text-white text-[12px] leading-[1.4] font-public-sans px-2 py-1 rounded uppercase tracking-wider">
                  Asamblea
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-[#404750] text-[12px] leading-[1.4] font-public-sans mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  18 de Agosto, 2023
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] font-public-sans mb-2">
                  Asamblea General Ordinaria
                </h3>
                <a href="#" className="inline-flex items-center gap-1 text-[#00558a] text-[14px] font-semibold leading-[1.2] font-public-sans hover:text-[#004a79] transition-colors">
                  Ver fotos
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Bento Grid */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b border-[#e3e2e7] pb-1">
            <h2 className="text-[24px] font-semibold leading-[1.3] text-[#1a1b1f] font-public-sans">
              Archivo Fotográfico
            </h2>
            <div className="flex gap-2">
              <button className="p-2 rounded bg-[#eeedf3] hover:bg-[#e9e7ed] transition-colors text-[#404750]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-[200px]">
            {/* Item 1 (Large) */}
            <div className="col-span-2 row-span-2 relative group overflow-hidden rounded cursor-pointer bg-[#e3e2e7]">
              <img
                alt="Hackathon"
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            {/* Item 2 */}
            <div className="relative group overflow-hidden rounded cursor-pointer bg-[#e3e2e7]">
              <img
                alt="Feria de Empleo"
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            {/* Item 3 */}
            <div className="relative group overflow-hidden rounded cursor-pointer bg-[#e3e2e7]">
              <img
                alt="Visita a Planta"
                src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            {/* Item 4 (Wide) */}
            <div className="col-span-2 relative group overflow-hidden rounded cursor-pointer bg-[#e3e2e7]">
              <img
                alt="Ceremonia de Premiación"
                src="https://images.unsplash.com/photo-1523580494112-071d1e53440e?w=1200&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Link CTA */}
        <section className="bg-[#f4f3f8] rounded-lg p-12 flex flex-col md:flex-row items-center justify-between border border-[#c0c7d1]">
          <div className="mb-6 md:mb-0">
            <h3 className="text-[20px] font-semibold leading-[1.4] text-[#1a1b1f] font-public-sans mb-1">
              ¿Buscás próximos eventos?
            </h3>
            <p className="text-[16px] leading-[1.6] text-[#404750] font-public-sans">
              Consultá nuestro calendario para no perderte ninguna actividad.
            </p>
          </div>
          <Link
            to="/eventos"
            className="bg-[#00558a] text-white text-[14px] font-semibold leading-[1.2] font-public-sans px-6 py-4 rounded hover:bg-[#004a79] transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver Calendario
          </Link>
        </section>
      </div>
    </>
  )
}
