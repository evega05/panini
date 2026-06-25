import { Reveal } from '../../hooks/useReveal'

export default function AboutSection() {
  return (
    <section id="nosotros" style={{ background: '#fff', padding: '120px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* Left — text */}
          <Reveal>
            <div>
              <p style={{
                fontSize: '.72rem',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#6b6b6b',
                marginBottom: 14,
                fontFamily: 'Inter, sans-serif',
              }}>
                Quiénes somos
              </p>
              <h2 style={{
                fontFamily: '"Instrument Serif", serif',
                fontSize: 'clamp(2rem,4vw,4rem)',
                fontWeight: 400,
                color: '#0a0a0a',
                lineHeight: 1.1,
                marginBottom: 28,
              }}>
                Más de 15 años{' '}
                <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>
                  transformando espacios.
                </em>
              </h2>
              <p style={{
                fontSize: '.92rem',
                color: '#6b6b6b',
                lineHeight: 1.8,
                fontFamily: 'Inter, sans-serif',
                marginBottom: 20,
              }}>
                Multiservicios Provenza nació en 2009 con un objetivo claro: ofrecer reformas
                integrales de alta calidad en el Gran Bilbao. Desde entonces, hemos completado
                más de 500 proyectos, ganándonos la confianza de cientos de familias y
                empresas en toda Bizkaia.
              </p>
              <p style={{
                fontSize: '.92rem',
                color: '#6b6b6b',
                lineHeight: 1.8,
                fontFamily: 'Inter, sans-serif',
                marginBottom: 36,
              }}>
                Contamos con un equipo de profesionales especializados en cada área — desde
                electricistas y fontaneros hasta carpinteros y pintores — coordinados por
                un director de obra que garantiza que cada proyecto se entregue en plazo,
                dentro de presupuesto y con los más altos estándares de calidad.
              </p>

              {/* Quick facts */}
              <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                {[
                  { num: '2009', label: 'Fundación' },
                  { num: '500+', label: 'Proyectos' },
                  { num: '15+', label: 'Profesionales' },
                ].map(fact => (
                  <div key={fact.num}>
                    <p style={{
                      fontFamily: '"Instrument Serif", serif',
                      fontSize: '2rem',
                      color: '#0a0a0a',
                      fontWeight: 400,
                      margin: '0 0 4px',
                      lineHeight: 1,
                    }}>
                      {fact.num}
                    </p>
                    <p style={{
                      fontSize: '.72rem',
                      color: '#6b6b6b',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      fontFamily: 'Inter, sans-serif',
                      margin: 0,
                    }}>
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — photo grid */}
          <Reveal delay={0.1} className="about-photos">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '260px 260px',
              gap: 12,
              height: '100%',
            }}>
              {/* First image — spans 2 rows */}
              <div style={{
                gridRow: '1 / 3',
                borderRadius: 16,
                overflow: 'hidden',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                  alt="Reforma"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Second image */}
              <div style={{ borderRadius: 16, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                  alt="Interior"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Third image */}
              <div style={{ borderRadius: 16, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80"
                  alt="Cocina"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .about-photos {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
