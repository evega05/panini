import { useEffect, useRef } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

const SERVICES = [
  { icon: '🔨', title: 'Reformas Integrales', desc: 'Transformamos tu espacio de arriba a abajo con precisión y calidad.' },
  { icon: '⚡', title: 'Instalaciones Eléctricas', desc: 'Electricidad residencial e industrial certificada y segura.' },
  { icon: '🔧', title: 'Fontanería', desc: 'Reparaciones, instalaciones y mantenimiento de tuberías.' },
  { icon: '🪟', title: 'Carpintería', desc: 'Puertas, ventanas, armarios y acabados en madera a medida.' },
  { icon: '🎨', title: 'Pintura', desc: 'Interiores y exteriores con acabados profesionales duraderos.' },
  { icon: '🧱', title: 'Albañilería', desc: 'Tabiques, enlucidos, solados y todo tipo de obra civil.' },
  { icon: '❄️', title: 'Climatización', desc: 'Instalación y mantenimiento de aire acondicionado y calefacción.' },
  { icon: '🚿', title: 'Baños & Cocinas', desc: 'Renovación completa con diseño moderno y materiales premium.' },
]

function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tick = () => {
      if (video.duration && !video.paused && !video.ended) {
        const t = video.currentTime
        const d = video.duration
        const fade = 0.5
        if (t < fade) {
          video.style.opacity = String(t / fade)
        } else if (d - t < fade) {
          video.style.opacity = String(Math.max(0, (d - t) / fade))
        } else {
          video.style.opacity = '1'
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
      }, 100)
    }

    rafRef.current = requestAnimationFrame(tick)
    video.addEventListener('ended', handleEnded)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="absolute z-0" style={{ inset: 'auto 0 0 0', top: '300px' }}>
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover block"
        style={{ opacity: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
    </div>
  )
}

const NAV_ITEMS = ['Inicio', 'Servicios', 'Nosotros', 'Contacto'] as const

function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="relative z-10 w-full px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="no-underline text-3xl tracking-tight text-black" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Provenza<sup>®</sup>
        </a>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_ITEMS.map((item) => {
            const id = item.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
            return (
              <li key={item}>
                <button
                  onClick={() => scrollTo(id)}
                  className={`text-sm transition-colors bg-transparent border-none cursor-pointer p-0 ${item === 'Inicio' ? 'text-black' : 'text-[#6F6F6F]'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item}
                </button>
              </li>
            )
          })}
        </ul>

        <button
          onClick={() => scrollTo('contacto')}
          className="rounded-full px-6 py-2.5 text-sm bg-black text-white transition-transform hover:scale-[1.03] cursor-pointer border-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Solicitar Presupuesto
        </button>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section id="inicio" className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40" style={{ paddingTop: 'calc(8rem - 75px)' }}>
      <p className="animate-fade-rise text-sm tracking-[0.2em] uppercase text-[#6F6F6F] mb-6 m-0" style={{ fontFamily: "'Inter', sans-serif" }}>
        Multiservicios Provenza
      </p>
      <h1
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl font-normal max-w-5xl m-0"
        style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 0.95, letterSpacing: '-2.46px', color: '#000000' }}
      >
        Reformamos tu hogar,{' '}
        <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>elevamos</em>
        {' '}tu{' '}
        <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>vida.</em>
      </h1>

      <p
        className="animate-fade-rise-delay text-base sm:text-lg max-w-2xl mt-8 leading-relaxed m-0"
        style={{ color: '#6F6F6F', fontFamily: "'Inter', sans-serif" }}
      >
        Especialistas en reformas integrales, instalaciones y todo tipo de servicios para el hogar y la empresa. Calidad, rapidez y garantía en cada trabajo.
      </p>

      <div className="animate-fade-rise-delay-2 flex flex-col sm:flex-row gap-4 mt-12">
        <button
          onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
          className="rounded-full px-14 py-5 text-base bg-black text-white transition-transform hover:scale-[1.03] cursor-pointer border-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Pedir Presupuesto
        </button>
        <button
          onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
          className="rounded-full px-14 py-5 text-base bg-transparent text-black border border-black transition-transform hover:scale-[1.03] cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Ver Servicios
        </button>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="servicios" className="relative z-10 px-8 py-32 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-sm tracking-[0.2em] uppercase text-[#6F6F6F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Lo que hacemos
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-normal m-0"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1, letterSpacing: '-1.5px', color: '#000000' }}
          >
            Servicios{' '}
            <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>a tu medida</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group p-8 border border-[#E8E8E8] rounded-2xl hover:border-black transition-all duration-300 cursor-default"
            >
              <span className="text-3xl block mb-5">{s.icon}</span>
              <h3
                className="text-lg font-normal mb-3 m-0"
                style={{ fontFamily: "'Instrument Serif', serif", color: '#000000' }}
              >
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed m-0" style={{ color: '#6F6F6F', fontFamily: "'Inter', sans-serif" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="nosotros" className="relative z-10 px-8 py-32 bg-[#F8F8F7]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-sm tracking-[0.2em] uppercase text-[#6F6F6F] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Quiénes somos
          </p>
          <h2
            className="text-4xl sm:text-5xl font-normal mb-8 m-0"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05, letterSpacing: '-1.5px', color: '#000000' }}
          >
            Más de 15 años{' '}
            <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>transformando espacios.</em>
          </h2>
          <p className="text-base leading-relaxed mb-6 m-0" style={{ color: '#6F6F6F', fontFamily: "'Inter', sans-serif" }}>
            En Multiservicios Provenza llevamos más de 15 años ofreciendo soluciones integrales para el hogar y la empresa. Nuestro equipo de profesionales cualificados garantiza resultados de calidad en cada proyecto.
          </p>
          <p className="text-base leading-relaxed m-0" style={{ color: '#6F6F6F', fontFamily: "'Inter', sans-serif" }}>
            Trabajamos con los mejores materiales y las técnicas más avanzadas para asegurar que cada reforma supere tus expectativas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { num: '+500', label: 'Proyectos completados' },
            { num: '15+', label: 'Años de experiencia' },
            { num: '100%', label: 'Clientes satisfechos' },
            { num: '24h', label: 'Respuesta garantizada' },
          ].map((stat) => (
            <div key={stat.label} className="p-8 bg-white rounded-2xl border border-[#E8E8E8]">
              <p className="text-4xl font-normal m-0 mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#000000' }}>
                {stat.num}
              </p>
              <p className="text-sm m-0" style={{ color: '#6F6F6F', fontFamily: "'Inter', sans-serif" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contacto" className="relative z-10 px-8 py-32 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm tracking-[0.2em] uppercase text-[#6F6F6F] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          Contacto
        </p>
        <h2
          className="text-4xl sm:text-5xl font-normal mb-6 m-0"
          style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.05, letterSpacing: '-1.5px', color: '#000000' }}
        >
          Cuéntanos tu{' '}
          <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>proyecto</em>
        </h2>
        <p className="text-base leading-relaxed mb-12 m-0" style={{ color: '#6F6F6F', fontFamily: "'Inter', sans-serif" }}>
          Solicita tu presupuesto sin compromiso. Te respondemos en menos de 24 horas.
        </p>

        <form
          className="flex flex-col gap-4 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="px-5 py-4 border border-[#E8E8E8] rounded-xl text-base outline-none focus:border-black transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}
            />
            <input
              type="tel"
              placeholder="Teléfono"
              className="px-5 py-4 border border-[#E8E8E8] rounded-xl text-base outline-none focus:border-black transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}
            />
          </div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="px-5 py-4 border border-[#E8E8E8] rounded-xl text-base outline-none focus:border-black transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}
          />
          <select
            className="px-5 py-4 border border-[#E8E8E8] rounded-xl text-base outline-none focus:border-black transition-colors appearance-none"
            style={{ fontFamily: "'Inter', sans-serif", color: '#6F6F6F' }}
          >
            <option value="">Tipo de servicio</option>
            {SERVICES.map((s) => <option key={s.title} value={s.title}>{s.title}</option>)}
          </select>
          <textarea
            placeholder="Describe tu proyecto..."
            rows={5}
            className="px-5 py-4 border border-[#E8E8E8] rounded-xl text-base outline-none focus:border-black transition-colors resize-none"
            style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}
          />
          <button
            type="submit"
            className="rounded-full px-14 py-5 text-base bg-black text-white transition-transform hover:scale-[1.03] cursor-pointer border-none mt-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Enviar Solicitud
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-center gap-8 mt-16 pt-16 border-t border-[#E8E8E8]">
          {[
            { label: 'Teléfono', value: '+34 612 345 678' },
            { label: 'Email', value: 'info@multiservicios-provenza.es' },
            { label: 'Horario', value: 'Lun–Vie 8:00–19:00' },
          ].map((c) => (
            <div key={c.label} className="text-center">
              <p className="text-xs tracking-[0.15em] uppercase text-[#6F6F6F] mb-1 m-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                {c.label}
              </p>
              <p className="text-sm m-0" style={{ fontFamily: "'Inter', sans-serif", color: '#000000' }}>
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 px-8 py-10 bg-black text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-2xl tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Provenza<sup>®</sup>
        </span>
        <p className="text-sm text-[#6F6F6F] m-0" style={{ fontFamily: "'Inter', sans-serif" }}>
          © {new Date().getFullYear()} Multiservicios Provenza. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Hero wrapper */}
      <div className="relative min-h-screen overflow-hidden">
        <VideoBackground />
        <Navbar />
        <HeroSection />
      </div>

      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
