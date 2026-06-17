import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWizard } from '../context/WizardContext'

const NAV_LINKS = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Para profesionales', href: '/profesionales' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { openWizard } = useWizard()
  const location = useLocation()

  const isExternal = (href: string) => href.startsWith('http')
  const isHashLink = (href: string) => href.includes('#')

  const renderLink = (href: string, label: string, className: string) => {
    if (isExternal(href)) {
      return <a href={href} className={className}>{label}</a>
    }
    if (isHashLink(href) && location.pathname !== '/') {
      return <a href={href} className={className}>{label}</a>
    }
    if (isHashLink(href)) {
      const hash = href.split('#')[1]
      return (
        <a
          href={`#${hash}`}
          className={className}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          {label}
        </a>
      )
    }
    return <Link to={href} className={className}>{label}</Link>
  }

  return (
    <nav className="relative z-50 w-full bg-white border-b border-gray-100 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="no-underline text-2xl tracking-tight text-black"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Ofizio<sup style={{ fontSize: '0.55em', verticalAlign: 'super' }}>®</sup>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={label}>
              {renderLink(
                href,
                label,
                'text-sm text-gray-500 hover:text-black transition-colors no-underline cursor-pointer',
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openWizard()}
            className="hidden md:block rounded-full px-5 py-2.5 text-sm bg-black text-white hover:bg-gray-900 transition-colors cursor-pointer border-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pedir presupuesto gratis
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <span className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4 shadow-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <div key={label} onClick={() => setMenuOpen(false)}>
              {renderLink(href, label, 'text-sm text-gray-700 no-underline block py-1')}
            </div>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openWizard() }}
            className="rounded-full px-5 py-3 text-sm bg-black text-white border-none cursor-pointer mt-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pedir presupuesto gratis
          </button>
        </div>
      )}
    </nav>
  )
}
