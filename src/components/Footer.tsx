export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a', padding: '52px 48px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.5rem', color: '#fff', letterSpacing: '-.03em' }}>
          Provenza<sup style={{ fontSize: '.55em', verticalAlign: 'super' }}>®</sup>
        </span>

        <nav style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            { label: 'Servicios', hash: 'servicios' },
            { label: 'Proyectos', hash: 'proyectos' },
            { label: 'Nosotros', hash: 'nosotros' },
            { label: 'Contacto', hash: 'contacto' },
          ].map(({ label, hash }) => (
            <a
              key={hash}
              href={`#${hash}`}
              onClick={e => { e.preventDefault(); document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ fontSize: '.75rem', color: '#484848', letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color .2s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#484848')}
            >
              {label}
            </a>
          ))}
        </nav>

        <div>
          <p style={{ fontSize: '.72rem', color: '#2a2a2a', margin: 0, fontFamily: "'Inter', sans-serif" }}>
            © {new Date().getFullYear()} Multiservicios Provenza. Todos los derechos reservados.
          </p>
          <span style={{ fontSize: '.68rem', color: '#2a2a2a', display: 'block', marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
            Nº de inscripción en el Registro de Empresas Instaladoras: BI-2009-1284 · Bizkaia
          </span>
        </div>
      </div>
    </footer>
  )
}
