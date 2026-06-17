import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWizard } from '../context/WizardContext'

const NAV_LINKS = [
  { label: 'Servicios', hash: 'servicios' },
  { label: 'Proyectos', hash: 'proyectos' },
  { label: 'Nosotros', hash: 'nosotros' },
  { label: 'Contacto', hash: 'contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openWizard } = useWizard()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const goTo = (hash: string) => {
    setMenuOpen(false)
    if (isHome) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = `/#${hash}`
    }
  }

  const headerStyle: React.CSSProperties = scrolled
    ? {
        background: 'rgba(255,255,255,.96)',
        padding: '16px 48px',
        boxShadow: '0 1px 0 rgba(0,0,0,.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }
    : {
        background: 'transparent',
        padding: '28px 48px',
      }

  const logoColor = scrolled ? '#0a0a0a' : '#fff'
  const linkColor = scrolled ? '#6b6b6b' : 'rgba(255,255,255,.65)'
  const linkHoverClass = scrolled ? 'hover:text-[#0a0a0a]' : 'hover:text-white'

  const btnStyle: React.CSSProperties = scrolled
    ? { background: '#0a0a0a', border: '1px solid #0a0a0a', color: '#fff' }
    : { background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.3)', color: '#fff' }

  const hamburgerColor = scrolled ? '#0a0a0a' : '#fff'

  return (
    <>
      <header
        id="hdr"
        className="fixed top-0 left-0 right-0 z-[500] transition-all duration-[450ms]"
        style={headerStyle}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/"
            style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.75rem', letterSpacing: '-.035em', color: logoColor, textDecoration: 'none', transition: 'color .45s' }}
          >
            Provenza<sup style={{ fontSize: '.55em', verticalAlign: 'super' }}>®</sup>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-10">
            {NAV_LINKS.map(({ label, hash }) => (
              <button
                key={hash}
                onClick={() => goTo(hash)}
                className={`text-[.78rem] tracking-[.06em] uppercase transition-colors duration-200 bg-transparent border-none cursor-pointer ${linkHoverClass}`}
                style={{ color: linkColor, fontFamily: "'Inter', sans-serif" }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => openWizard()}
              className="hidden md:block rounded-full transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              style={{ ...btnStyle, padding: '10px 26px', fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}
            >
              Presupuesto
            </button>

            {/* Hamburger */}
            <button
              className="flex md:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-0 w-[30px]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <span style={{ height: '1.5px', background: hamburgerColor, borderRadius: 2, transition: 'transform .35s, opacity .35s, background .45s', display: 'block', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
              <span style={{ height: '1.5px', background: hamburgerColor, borderRadius: 2, transition: 'opacity .35s', display: 'block', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ height: '1.5px', background: hamburgerColor, borderRadius: 2, transition: 'transform .35s, background .45s', display: 'block', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className="fixed inset-0 z-[490] flex flex-col items-center justify-center gap-2 transition-opacity duration-[400ms]"
        style={{ background: '#0a0a0a', opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'all' : 'none' }}
      >
        {NAV_LINKS.map(({ label, hash }) => (
          <button
            key={hash}
            onClick={() => goTo(hash)}
            className="bg-transparent border-none cursor-pointer transition-colors duration-200"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(2.2rem,7vw,4rem)',
              color: 'rgba(255,255,255,.2)',
              letterSpacing: '-.03em',
              lineHeight: 1.2,
              padding: '4px 0',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.2)')}
          >
            {label}
          </button>
        ))}
        <div style={{ marginTop: 56, textAlign: 'center', color: '#444', fontSize: '.82rem', lineHeight: 2 }}>
          <p><a href="tel:+34624118284" style={{ color: 'inherit', textDecoration: 'none' }}>+34 624 118 284</a></p>
          <p>inforeformasmiribilla@gmail.com</p>
        </div>
      </div>
    </>
  )
}
