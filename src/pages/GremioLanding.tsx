import { useParams, Link } from 'react-router-dom'
import { getGremioBySlug, GREMIOS } from '../data/gremios'
import { MUNICIPIOS } from '../data/municipios'
import { useWizard } from '../context/WizardContext'

const MUNICIPIO_DISPLAY: Record<string, string> = {
  bilbao: 'Bilbao',
  getxo: 'Getxo',
  barakaldo: 'Barakaldo',
  portugalete: 'Portugalete',
  santurtzi: 'Santurtzi',
  sestao: 'Sestao',
  leioa: 'Leioa',
  erandio: 'Erandio',
  basauri: 'Basauri',
  galdakao: 'Galdakao',
  etxebarri: 'Etxebarri',
  sondika: 'Sondika',
  loiu: 'Loiu',
  berango: 'Berango',
  sopela: 'Sopela',
  trapagaran: 'Trapagaran',
  muskiz: 'Muskiz',
  zamudio: 'Zamudio',
  derio: 'Derio',
  alonsotegi: 'Alonsotegi',
}

export default function GremioLanding() {
  const { slug, municipio: municipioSlug } = useParams<{ slug: string; municipio?: string }>()
  const { openWizard } = useWizard()

  const gremio = slug ? getGremioBySlug(slug) : undefined
  const municipioName = municipioSlug ? (MUNICIPIO_DISPLAY[municipioSlug] ?? null) : null

  if (!gremio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-2xl font-normal m-0 mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Servicio no encontrado
        </h1>
        <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors no-underline">
          ← Volver al inicio
        </Link>
      </div>
    )
  }

  const locationLabel = municipioName
    ? `${gremio.nombreCorto} en ${municipioName}`
    : `${gremio.nombreCorto} en el Gran Bilbao`

  const relatedGremios = GREMIOS.filter((g) => g.id !== gremio.id).slice(0, 6)

  return (
    <div className="bg-white">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20 text-center max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
          {municipioName ? `${municipioName} · Gran Bilbao` : 'Gran Bilbao'}
        </p>
        <h1
          className="text-4xl sm:text-6xl font-normal m-0 mb-5"
          style={{
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1,
            letterSpacing: '-1.5px',
          }}
        >
          {gremio.icon} {locationLabel}
        </h1>
        <p className="text-base text-gray-500 max-w-lg mx-auto mb-8 m-0 leading-relaxed">
          {gremio.descripcion}
          {municipioName && ` Profesionales verificados en ${municipioName} y alrededores.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => openWizard(gremio.id)}
            className="rounded-full px-8 py-4 text-sm bg-black text-white hover:bg-gray-900 transition-colors border-none cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pedir presupuesto gratis →
          </button>
          <a
            href="#precios"
            className="rounded-full px-8 py-4 text-sm border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors no-underline"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Ver precios orientativos
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-400">
          <span>✓ Respuesta en 24h</span>
          <span>✓ Equipo verificado</span>
          <span>✓ Sin compromiso</span>
        </div>
      </section>

      {/* ── SERVICIOS ────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#F8F8F7] border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3 m-0">Lo que incluye</p>
            <h2
              className="text-3xl sm:text-4xl font-normal m-0"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1, letterSpacing: '-1px' }}
            >
              Servicios de {gremio.nombreCorto.toLowerCase()}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gremio.servicios.map((s) => (
              <div
                key={s}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100"
              >
                <span className="text-gray-400 mt-0.5 flex-shrink-0">→</span>
                <span className="text-sm text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ──────────────────────────────────────── */}
      <section id="precios" className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
            Precios orientativos
          </p>
          <h2
            className="text-3xl sm:text-4xl font-normal m-0 mb-6"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1, letterSpacing: '-1px' }}
          >
            ¿Cuánto cuesta un {gremio.nombreCorto.toLowerCase()} en{' '}
            {municipioName ?? 'el Gran Bilbao'}?
          </h2>

          <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center bg-[#F8F8F7] rounded-2xl p-8 border border-gray-100 mb-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 m-0">Desde</p>
              <p
                className="text-5xl font-normal m-0"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {gremio.precios.min}€
              </p>
              <p className="text-xs text-gray-400 m-0">por {gremio.precios.unidad}</p>
            </div>
            <div className="text-3xl text-gray-300 hidden sm:block">—</div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 m-0">Hasta</p>
              <p
                className="text-5xl font-normal m-0"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {gremio.precios.max}€
              </p>
              <p className="text-xs text-gray-400 m-0">por {gremio.precios.unidad}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-10 m-0">
            Precios orientativos para el Gran Bilbao. El presupuesto final depende del trabajo concreto,
            materiales y desplazamiento. Pide tu presupuesto personalizado gratis.
          </p>

          <button
            onClick={() => openWizard(gremio.id)}
            className="rounded-full px-10 py-4 text-sm bg-black text-white hover:bg-gray-900 transition-colors border-none cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Obtener mi presupuesto real →
          </button>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      {gremio.faq && gremio.faq.length > 0 && (
        <section className="px-6 py-20 bg-[#F8F8F7] border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3 m-0">Preguntas frecuentes</p>
              <h2
                className="text-3xl sm:text-4xl font-normal m-0"
                style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1, letterSpacing: '-1px' }}
              >
                Lo que más nos preguntan sobre{' '}
                {gremio.nombreCorto.toLowerCase()}
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              {gremio.faq.map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3
                    className="text-base font-normal m-0 mb-3"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {q}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed m-0">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COBERTURA MUNICIPAL ───────────────────────────── */}
      <section className="px-6 py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
            Dónde trabajamos
          </p>
          <h2
            className="text-2xl sm:text-3xl font-normal m-0 mb-6"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1 }}
          >
            {gremio.icon} {gremio.nombreCorto} en todos los municipios del Gran Bilbao
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {MUNICIPIOS.map((m) => (
              <Link
                key={m}
                to={`/servicios/${gremio.slug}/${m.toLowerCase()}`}
                className="no-underline text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:border-black hover:text-black transition-colors"
              >
                {gremio.nombreCorto} en {m}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTROS GREMIOS ────────────────────────────────── */}
      <section className="px-6 py-16 bg-[#F8F8F7] border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-6 m-0 text-center">
            También disponible
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {relatedGremios.map((g) => (
              <Link
                key={g.id}
                to={`/servicios/${g.slug}`}
                className="no-underline p-4 bg-white border border-gray-200 rounded-xl hover:border-black transition-all text-center"
              >
                <span className="text-xl block mb-2">{g.icon}</span>
                <span className="text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {g.nombreCorto}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="px-6 py-20 bg-black text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-normal m-0 mb-4 text-white"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05, letterSpacing: '-1px' }}
          >
            {gremio.icon} {gremio.nombreCorto} en {municipioName ?? 'el Gran Bilbao'}:{' '}
            <em style={{ color: '#9CA3AF', fontStyle: 'italic' }}>presupuesto gratis hoy.</em>
          </h2>
          <p className="text-sm text-gray-400 mb-8 m-0">
            Profesionales verificados. Respuesta en 24 horas. Sin compromiso.
          </p>
          <button
            onClick={() => openWizard(gremio.id)}
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
