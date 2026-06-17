import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GREMIOS } from '../data/gremios'
import { MUNICIPIOS } from '../data/municipios'
import { useWizard } from '../context/WizardContext'

const STATS = [
  { num: '50+', label: 'Profesionales verificados' },
  { num: '15', label: 'Gremios cubiertos' },
  { num: '24h', label: 'Respuesta media' },
  { num: '100%', label: 'Gran Bilbao' },
]

const STEPS = [
  {
    num: '01',
    title: 'Cuéntanos tu reforma',
    desc: 'Describe el trabajo que necesitas, tu municipio y si tienes urgencia. En menos de 2 minutos.',
  },
  {
    num: '02',
    title: 'Recibe propuestas verificadas',
    desc: 'En menos de 24 horas recibes presupuestos de profesionales de tu zona. Sin llamadas indeseadas.',
  },
  {
    num: '03',
    title: 'Elige con tranquilidad',
    desc: 'Compara, valora y contrata al profesional que más te convenza. Con garantía y seguimiento.',
  },
]

const TESTIMONIALS = [
  {
    text: 'Necesitaba un electricista urgente para cambiar el cuadro antes de vender el piso. En menos de 4 horas tenía dos presupuestos y al día siguiente lo tenía instalado.',
    author: 'Marta G.',
    location: 'Getxo',
    gremio: 'Electricidad',
    rating: 5,
  },
  {
    text: 'Reformamos el baño completo. El fontanero y el alicatador coordinaron perfectamente sin que yo tuviera que hacer de intermediaria. Resultado impecable.',
    author: 'Jon A.',
    location: 'Bilbao',
    gremio: 'Reforma de baño',
    rating: 5,
  },
  {
    text: 'El pintor llegó a la hora, terminó en los plazos y el precio fue exactamente el del presupuesto. Nada de sorpresas al final.',
    author: 'Leire U.',
    location: 'Barakaldo',
    gremio: 'Pintura',
    rating: 5,
  },
]

const TRUST_POINTS = [
  { icon: '✓', text: 'Profesionales con alta de autónomo o empresa verificados' },
  { icon: '✓', text: 'Seguro de responsabilidad civil obligatorio' },
  { icon: '✓', text: 'Valoraciones reales de clientes tras la obra' },
  { icon: '✓', text: 'Cumplimiento fiscal Batuz/TicketBai integrado' },
]

function Stars({ n }: { n: number }) {
  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? 'text-black' : 'text-gray-300'}>★</span>
      ))}
    </span>
  )
}

export default function Home() {
  const { openWizard } = useWizard()
  const [selectedGremio, setSelectedGremio] = useState('')
  const [selectedMunicipio, setSelectedMunicipio] = useState('')

  const handleSearch = () => {
    if (selectedGremio) {
      openWizard(selectedGremio)
    } else {
      openWizard()
    }
  }

  return (
    <div className="bg-white">
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section
        id="inicio"
        className="relative px-6 pt-20 pb-28 flex flex-col items-center text-center overflow-hidden"
      >
        {/* Subtle background circle */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #f5f5f5 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-4xl">
          <p
            className="animate-fade-rise text-xs tracking-[0.25em] uppercase text-gray-400 mb-7 m-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Gran Bilbao · Profesionales verificados
          </p>

          <h1
            className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl font-normal m-0 mb-6"
            style={{
              fontFamily: "'Instrument Serif', serif",
              lineHeight: 0.95,
              letterSpacing: '-2px',
              color: '#000',
            }}
          >
            Tu reforma en el
            <br />
            Gran Bilbao,{' '}
            <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>con profesionales{' '}
            <span style={{ whiteSpace: 'nowrap' }}>de verdad.</span></em>
          </h1>

          <p
            className="animate-fade-rise-delay text-base sm:text-lg text-gray-500 max-w-xl mx-auto mt-0 mb-10 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Conectamos particulares y comunidades de propietarios con profesionales
            verificados de todos los gremios. Presupuesto gratuito en 24 horas, sin compromisos.
          </p>

          {/* Search row */}
          <div className="animate-fade-rise-delay-2 flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto mb-10">
            <select
              value={selectedGremio}
              onChange={(e) => setSelectedGremio(e.target.value)}
              className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors appearance-none bg-white text-gray-500"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <option value="">¿Qué servicio necesitas?</option>
              {GREMIOS.map((g) => (
                <option key={g.id} value={g.id}>{g.icon} {g.nombreCorto}</option>
              ))}
            </select>

            <select
              value={selectedMunicipio}
              onChange={(e) => setSelectedMunicipio(e.target.value)}
              className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors appearance-none bg-white text-gray-500"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <option value="">¿En qué municipio?</option>
              {MUNICIPIOS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="rounded-xl px-7 py-3.5 text-sm bg-black text-white hover:bg-gray-900 transition-colors border-none cursor-pointer whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Pedir presupuesto gratis →
            </button>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            {['✓ Sin registro previo', '✓ Presupuesto en 24h', '✓ Solo profesionales verificados'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-[#F8F8F7]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <p
                className="text-4xl font-normal m-0 mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {num}
              </p>
              <p className="text-xs text-gray-500 m-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────────────────── */}
      <section id="como-funciona" className="px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-4 m-0">
              El proceso
            </p>
            <h2
              className="text-4xl sm:text-5xl font-normal m-0"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1, letterSpacing: '-1.5px' }}
            >
              Tan fácil como{' '}
              <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>tres pasos.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col">
                <p
                  className="text-5xl font-normal text-gray-200 m-0 mb-5"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {num}
                </p>
                <h3
                  className="text-xl font-normal m-0 mb-3"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed m-0">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => openWizard()}
              className="rounded-full px-10 py-4 text-sm bg-black text-white hover:bg-gray-900 transition-colors border-none cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Pedir mi presupuesto gratis
            </button>
          </div>
        </div>
      </section>

      {/* ── GREMIOS GRID ────────────────────────────────────────── */}
      <section id="servicios" className="px-6 py-28 bg-[#F8F8F7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-4 m-0">
              Todos los gremios
            </p>
            <h2
              className="text-4xl sm:text-5xl font-normal m-0"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1, letterSpacing: '-1.5px' }}
            >
              Lo que sea que necesites,{' '}
              <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>lo tenemos.</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {GREMIOS.map((g) => (
              <Link
                key={g.id}
                to={`/servicios/${g.slug}`}
                className="no-underline group p-5 bg-white border border-gray-200 rounded-2xl hover:border-black hover:shadow-sm transition-all duration-200 flex flex-col gap-3"
              >
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <p
                    className="text-sm font-normal m-0 mb-1 group-hover:text-black transition-colors"
                    style={{ fontFamily: "'Instrument Serif', serif", color: '#111827', lineHeight: 1.3 }}
                  >
                    {g.nombreCorto}
                  </p>
                  {g.piloto && (
                    <span className="text-xs bg-black text-white rounded-full px-2 py-0.5">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 m-0 leading-relaxed line-clamp-2">
                  {g.descripcion}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONFIANZA ───────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
              Verificación
            </p>
            <h2
              className="text-4xl sm:text-5xl font-normal m-0 mb-6"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05, letterSpacing: '-1.5px' }}
            >
              No cualquiera entra{' '}
              <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>en Ofizio.</em>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 m-0">
              Antes de publicar su perfil, cada profesional pasa por un proceso de verificación documental.
              Comprobamos que estén dados de alta, que tengan seguro de responsabilidad civil
              y que cumplan con la normativa fiscal vasca.
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {TRUST_POINTS.map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-sm mt-0.5 flex-shrink-0">{icon}</span>
                  <span className="text-sm text-gray-600">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-[#F8F8F7] rounded-2xl p-6 border border-gray-100">
                <Stars n={t.rating} />
                <p className="text-sm text-gray-700 leading-relaxed my-3 m-0 mt-3 mb-3">
                  "{t.text}"
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {t.author} · {t.location}
                  </span>
                  <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2.5 py-1">
                    {t.gremio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COBERTURA GEOGRÁFICA ─────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#F8F8F7] border-y border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
            Cobertura
          </p>
          <h2
            className="text-3xl sm:text-4xl font-normal m-0 mb-4"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1, letterSpacing: '-1px' }}
          >
            20 municipios del Gran Bilbao cubiertos.
          </h2>
          <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto m-0">
            Desde Bilbao hasta Muskiz, Sopela o Zamudio. Si estás en el Gran Bilbao, tenemos profesionales cerca.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {MUNICIPIOS.map((m) => (
              <span
                key={m}
                className="text-xs border border-gray-200 bg-white rounded-full px-3 py-1.5 text-gray-600 hover:border-gray-400 transition-colors cursor-default"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA PROFESIONALES ────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
            Para profesionales
          </p>
          <h2
            className="text-4xl sm:text-5xl font-normal m-0 mb-6"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05, letterSpacing: '-1.5px' }}
          >
            ¿Eres profesional de la reforma?{' '}
            <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>Únete a Ofizio.</em>
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto m-0">
            Recibe leads cualificados del Gran Bilbao, gestiona tu agenda y factura con
            cumplimiento Batuz/TicketBai integrado. Sin pagar por leads de baja calidad:
            solo comisión cuando cierras obra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/profesionales"
              className="no-underline rounded-full px-10 py-4 text-sm bg-black text-white hover:bg-gray-900 transition-colors inline-block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Quiero unirme →
            </Link>
            <Link
              to="/profesionales"
              className="no-underline rounded-full px-10 py-4 text-sm border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors inline-block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Ver condiciones
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-black text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-4xl sm:text-5xl font-normal m-0 mb-4 text-white"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05, letterSpacing: '-1.5px' }}
          >
            Tu reforma empieza{' '}
            <em style={{ color: '#9CA3AF', fontStyle: 'italic' }}>hoy.</em>
          </h2>
          <p className="text-sm text-gray-400 mb-8 m-0">
            Presupuesto gratuito. Sin compromiso. Profesionales de tu zona en 24 horas.
          </p>
          <button
            onClick={() => openWizard()}
            className="rounded-full px-10 py-4 text-sm bg-white text-black hover:bg-gray-100 transition-colors border-none cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pedir presupuesto gratis
          </button>
        </div>
      </section>
    </div>
  )
}
