import { Reveal } from '../../hooks/useReveal'

const CERTS = [
  {
    icon: '⚡',
    title: 'Instalador Eléctrico Autorizado',
    desc: 'Habilitado por el Ministerio de Industria (RITSIC)',
  },
  {
    icon: '🔥',
    title: 'Instalador de Gas Categoría A',
    desc: 'Autorización Gobierno Vasco',
  },
  {
    icon: '🛡️',
    title: 'Seguro RC Profesional',
    desc: 'Cobertura hasta 600.000€ por siniestro',
  },
  {
    icon: '✅',
    title: 'Empresa Registrada',
    desc: 'Inscrita en el Registro de Contratistas de Bizkaia',
  },
]

export default function Certifications() {
  return (
    <section style={{ background: '#fff', padding: '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <Reveal>
          <p style={{
            fontSize: '.72rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#6b6b6b',
            marginBottom: 14,
            fontFamily: 'Inter, sans-serif',
          }}>
            Certificados & Homologaciones
          </p>
          <h2 style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(2.2rem,4.5vw,4.5rem)',
            fontWeight: 400,
            color: '#0a0a0a',
            lineHeight: 1.08,
            marginBottom: 56,
          }}>
            Trabajamos con{' '}
            <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>todas las garantías</em>
          </h2>
        </Reveal>

        <div
          className="certs-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
        >
          {CERTS.map((cert, idx) => (
            <Reveal key={cert.title} delay={idx * 0.08}>
              <div
                style={{
                  border: '1px solid #e8e6e2',
                  borderRadius: 16,
                  padding: 28,
                  transition: 'border-color .25s ease, transform .25s ease',
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#0a0a0a'
                  el.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e8e6e2'
                  el.style.transform = 'none'
                }}
              >
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{cert.icon}</span>
                <div>
                  <h3 style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: '1.05rem',
                    fontWeight: 400,
                    color: '#0a0a0a',
                    margin: '0 0 8px',
                    lineHeight: 1.35,
                  }}>
                    {cert.title}
                  </h3>
                  <p style={{
                    fontSize: '.8rem',
                    color: '#6b6b6b',
                    fontFamily: 'Inter, sans-serif',
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    {cert.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .certs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .certs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
