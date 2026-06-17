import { GREMIOS } from '../data/gremios'

const BENEFITS = [
  {
    icon: '🎯',
    title: 'Leads cualificados de tu zona',
    desc: 'Recibes solicitudes de clientes reales del Gran Bilbao, segmentadas por tu gremio y municipio. Sin perder tiempo con leads de otras provincias.',
  },
  {
    icon: '💰',
    title: 'Modelo justo: solo comisión al cerrar',
    desc: 'Cuota mensual baja + comisión reducida solo sobre obras cerradas. No pagas por leads de baja calidad que no convierten.',
  },
  {
    icon: '📋',
    title: 'Batuz/TicketBai integrado',
    desc: 'Cumplimiento fiscal vasco automatizado. Generamos los tiques verificados con tu certificado digital. Sin dolores de cabeza con Hacienda.',
  },
  {
    icon: '⭐',
    title: 'Perfil verificado con valoraciones',
    desc: 'Tu perfil muestra tus valoraciones reales de clientes (solo tras obra confirmada). Construye reputación digital en el Gran Bilbao.',
  },
  {
    icon: '📅',
    title: 'Gestión de agenda integrada',
    desc: 'Panel propio para gestionar tus leads, presupuestos pendientes, obras en curso y facturas. Todo en un sitio.',
  },
  {
    icon: '📱',
    title: 'Notificaciones por WhatsApp',
    desc: 'Recibes cada nuevo lead por WhatsApp Business en tiempo real. Responde rápido, gana el trabajo.',
  },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Solicita el alta', desc: 'Rellena el formulario con tus datos y área de trabajo.' },
  { num: '02', title: 'Verificación documental', desc: 'Te pedimos alta de autónomo/empresa y seguro de RC vigente.' },
  { num: '03', title: 'Activa tu perfil', desc: 'Una vez verificado, tu perfil aparece en las búsquedas del Gran Bilbao.' },
  { num: '04', title: 'Recibe leads y cierra obras', desc: 'Gestiona todo desde tu panel y cobra con TicketBai incluido.' },
]

const PRICING = [
  {
    plan: 'Starter',
    price: '29',
    period: 'mes',
    desc: 'Para autónomos que empiezan',
    features: [
      'Hasta 10 leads al mes',
      'Perfil verificado básico',
      'Notificaciones WhatsApp',
      '5% comisión sobre obra cerrada',
    ],
    cta: 'Empezar gratis 30 días',
    highlight: false,
  },
  {
    plan: 'Profesional',
    price: '59',
    period: 'mes',
    desc: 'Para profesionales activos',
    features: [
      'Leads ilimitados',
      'Perfil destacado en búsquedas',
      'Gestión de agenda integrada',
      'Batuz/TicketBai automatizado',
      '3% comisión sobre obra cerrada',
    ],
    cta: 'Empezar gratis 30 días',
    highlight: true,
  },
  {
    plan: 'Empresa',
    price: '149',
    period: 'mes',
    desc: 'Para empresas con equipo',
    features: [
      'Todo lo de Profesional',
      'Hasta 5 operarios en perfil',
      'Dashboard de empresa',
      'Soporte prioritario',
      '2% comisión sobre obra cerrada',
    ],
    cta: 'Contactar ventas',
    highlight: false,
  },
]

export default function Profesionales() {
  const handleSignup = () => {
    window.open('https://wa.me/34600000000?text=' + encodeURIComponent('Hola, me interesa unirme a Ofizio como profesional. ¿Cómo empiezo?'), '_blank')
  }

  return (
    <div className="bg-white">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-24 text-center max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-6 m-0">
          Para profesionales
        </p>
        <h1
          className="text-4xl sm:text-6xl font-normal m-0 mb-5"
          style={{
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          Más clientes en el Gran Bilbao.{' '}
          <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>Menos tiempo buscándolos.</em>
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto mb-10 m-0 leading-relaxed">
          Únete a la red de profesionales verificados de Ofizio. Recibe leads cualificados de tu zona,
          gestiona tu agenda y factura con cumplimiento fiscal vasco integrado.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleSignup}
            className="rounded-full px-10 py-4 text-sm bg-black text-white hover:bg-gray-900 transition-colors border-none cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Solicitar alta por WhatsApp →
          </button>
          <a
            href="#precios"
            className="rounded-full px-10 py-4 text-sm border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors no-underline"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Ver planes y precios
          </a>
        </div>
      </section>

      {/* ── GREMIOS DISPONIBLES ──────────────────────── */}
      <section className="px-6 py-12 bg-[#F8F8F7] border-y border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
            Gremios activos
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {GREMIOS.map((g) => (
              <span
                key={g.id}
                className={`text-xs rounded-full px-3 py-1.5 border ${
                  g.piloto
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {g.icon} {g.nombreCorto}
                {g.piloto && <span className="ml-1 opacity-70">✓</span>}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 m-0">
            Los marcados en negro están activos. El resto se incorporan en los próximos meses.
          </p>
        </div>
      </section>

      {/* ── BENEFICIOS ──────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-4 m-0">Por qué Ofizio</p>
            <h2
              className="text-4xl sm:text-5xl font-normal m-0"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1, letterSpacing: '-1.5px' }}
            >
              No es solo otro portal de leads.{' '}
              <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>Es diferente.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="p-6 border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors">
                <span className="text-2xl block mb-4">{icon}</span>
                <h3
                  className="text-lg font-normal m-0 mb-2"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed m-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESO DE ALTA ─────────────────────────── */}
      <section className="px-6 py-24 bg-[#F8F8F7] border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-4 m-0">Cómo funciona</p>
            <h2
              className="text-3xl sm:text-4xl font-normal m-0"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1, letterSpacing: '-1px' }}
            >
              Alta en 48 horas, clientes desde el primer día.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {PROCESS_STEPS.map(({ num, title, desc }) => (
              <div key={num}>
                <p
                  className="text-4xl font-normal text-gray-200 m-0 mb-4"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {num}
                </p>
                <h3
                  className="text-base font-normal m-0 mb-2"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed m-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ─────────────────────────────────── */}
      <section id="precios" className="px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-4 m-0">Planes</p>
            <h2
              className="text-3xl sm:text-4xl font-normal m-0"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1, letterSpacing: '-1px' }}
            >
              Sin sorpresas. Precio transparente.
            </h2>
            <p className="text-sm text-gray-500 mt-3 m-0">
              30 días de prueba gratis. Sin tarjeta de crédito. Cancela cuando quieras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map(({ plan, price, period, desc, features, cta, highlight }) => (
              <div
                key={plan}
                className={`rounded-2xl p-7 flex flex-col ${
                  highlight
                    ? 'bg-black text-white'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                <p className={`text-xs uppercase tracking-widest mb-1 m-0 ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>
                  {plan}
                </p>
                <p className={`text-xs mb-5 m-0 ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>{desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className="text-4xl font-normal"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {price}€
                  </span>
                  <span className={`text-sm ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>/{period}</span>
                </div>
                <ul className="list-none m-0 p-0 flex flex-col gap-2.5 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className={`text-xs mt-0.5 flex-shrink-0 ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>✓</span>
                      <span className={`text-sm ${highlight ? 'text-gray-200' : 'text-gray-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleSignup}
                  className={`rounded-full py-3 text-sm border-none cursor-pointer transition-colors w-full ${
                    highlight
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUMPLIMIENTO FISCAL ─────────────────────── */}
      <section className="px-6 py-20 bg-[#F8F8F7] border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5 m-0">
            Bizkaia · Batuz · TicketBai
          </p>
          <h2
            className="text-3xl sm:text-4xl font-normal m-0 mb-5"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1, letterSpacing: '-1px' }}
          >
            Cumplimiento fiscal vasco{' '}
            <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>integrado desde el día uno.</em>
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 m-0">
            Para los profesionales radicados en Bizkaia, Batuz y TicketBai son obligatorios.
            En Ofizio generamos los tiques verificados con tu certificado digital directamente desde la plataforma,
            sin que tengas que salir a otra aplicación ni depender de un gestor para cada factura.
          </p>
          <p className="text-xs text-gray-400 m-0">
            Para certificados digitales no exportables usamos un sistema de bot supervisado. Consulta los detalles en el onboarding.
          </p>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────── */}
      <section className="px-6 py-24 bg-black text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-normal m-0 mb-4 text-white"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05, letterSpacing: '-1px' }}
          >
            Tu próximo cliente está{' '}
            <em style={{ color: '#9CA3AF', fontStyle: 'italic' }}>buscando en Ofizio.</em>
          </h2>
          <p className="text-sm text-gray-400 mb-8 m-0">
            Alta en 48 horas. 30 días de prueba gratis. Sin permanencia.
          </p>
          <button
            onClick={handleSignup}
            className="rounded-full px-10 py-4 text-sm bg-white text-black hover:bg-gray-100 transition-colors border-none cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Solicitar alta por WhatsApp →
          </button>
        </div>
      </section>
    </div>
  )
}
