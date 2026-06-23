import { Reveal } from '../../hooks/useReveal'

const TESTIMONIALS = [
  {
    name: 'María García',
    location: 'Bilbao',
    initials: 'MG',
    text: 'La reforma integral de nuestro piso fue impecable. El equipo llegó puntual cada día y el resultado superó todas nuestras expectativas. Totalmente recomendable.',
  },
  {
    name: 'Carlos Rodríguez',
    location: 'Getxo',
    initials: 'CR',
    text: 'Contraté a Provenza para una instalación eléctrica completa y quedé encantado. Profesionales, limpios, y con precios muy competitivos. Los volvería a llamar sin dudarlo.',
  },
  {
    name: 'Ana López',
    location: 'Barakaldo',
    initials: 'AL',
    text: 'Reforma integral de un piso antiguo en tiempo récord. Coordinaron todo perfectamente y el acabado final es de lujo. ¡Volveré a contratarles sin ninguna duda!',
  },
]

export default function Testimonials() {
  return (
    <section style={{ background: '#fff', padding: '120px 0' }}>
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
            Clientes satisfechos
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 64 }}>
            <h2 style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 'clamp(2.2rem,4.5vw,4.5rem)',
              fontWeight: 400,
              color: '#0a0a0a',
              lineHeight: 1.08,
              margin: 0,
            }}>
              Lo que dicen{' '}
              <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>de nosotros</em>
            </h2>

            {/* Google Reviews badge */}
            <a
              href="https://www.google.com/maps/search/Multiservicios+Provenza+Bilbao"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid #e8e6e2',
                borderRadius: 12,
                padding: '10px 18px',
                textDecoration: 'none',
                transition: 'border-color .2s ease, transform .2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                t.style.borderColor = '#0a0a0a'
                t.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                t.style.borderColor = '#e8e6e2'
                t.style.transform = 'none'
              }}
            >
              {/* Google G */}
              <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-.02em' }}>
                <span style={{ color: '#4285F4' }}>G</span>
                <span style={{ color: '#EA4335' }}>o</span>
                <span style={{ color: '#FBBC05' }}>o</span>
                <span style={{ color: '#4285F4' }}>g</span>
                <span style={{ color: '#34A853' }}>l</span>
                <span style={{ color: '#EA4335' }}>e</span>
              </span>
              <span style={{ color: '#FBBC05', fontSize: '.85rem' }}>★★★★★</span>
              <span style={{ fontSize: '.78rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif' }}>
                4.9 · 47 reseñas en Google
              </span>
            </a>
          </div>
        </Reveal>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
          className="testimonials-grid"
        >
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 0.08}>
              <div
                style={{
                  border: '1px solid #e8e6e2',
                  borderRadius: 20,
                  padding: 40,
                  transition: 'border-color .25s ease, transform .25s ease',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#0a0a0a'
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e8e6e2'
                  el.style.transform = 'none'
                }}
              >
                {/* Stars */}
                <p style={{ color: '#FBBC05', fontSize: '.85rem', margin: '0 0 18px' }}>★★★★★</p>

                {/* Quote */}
                <blockquote style={{
                  fontFamily: '"Instrument Serif", serif',
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: '#0a0a0a',
                  margin: '0 0 28px',
                  fontWeight: 400,
                }}>
                  "{t.text}"
                </blockquote>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: '#f5f4f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.72rem',
                    fontWeight: 600,
                    color: '#6b6b6b',
                    fontFamily: 'Inter, sans-serif',
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '.88rem', fontWeight: 600, color: '#0a0a0a', fontFamily: 'Inter, sans-serif' }}>
                      {t.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '.75rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif' }}>
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
