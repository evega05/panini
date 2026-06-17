import { Reveal } from '../../hooks/useReveal'

const STEPS = [
  {
    num: '01',
    title: 'Visita & Presupuesto',
    desc: 'Visitamos tu espacio sin compromiso y preparamos un presupuesto detallado en menos de 24 horas.',
  },
  {
    num: '02',
    title: 'Diseño & Planificación',
    desc: 'Diseñamos cada detalle de tu reforma y organizamos materiales y gremios con precisión milimétrica.',
  },
  {
    num: '03',
    title: 'Ejecución',
    desc: 'Nuestro equipo trabaja con rigor, respetando plazos y manteniendo tu hogar lo más limpio posible en todo momento.',
  },
  {
    num: '04',
    title: 'Entrega & Revisión',
    desc: 'Te entregamos el proyecto terminado con revisión final y acta de conformidad firmada.',
  },
]

export default function ProcessSection() {
  return (
    <section style={{ background: '#f5f4f2', padding: '120px 0' }}>
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
            Cómo trabajamos
          </p>
          <h2 style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(2.2rem,4.5vw,4.5rem)',
            fontWeight: 400,
            color: '#0a0a0a',
            lineHeight: 1.08,
            marginBottom: 72,
          }}>
            Proceso{' '}
            <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>sin complicaciones</em>
          </h2>
        </Reveal>

        {/* Steps grid */}
        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div
            className="process-line"
            style={{
              position: 'absolute',
              top: 28,
              left: 'calc(12.5% - 0px)',
              right: 'calc(12.5% - 0px)',
              height: 1,
              background: '#d8d6d2',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          <div
            className="process-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 32,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {STEPS.map((step, idx) => (
              <Reveal key={step.num} delay={idx * 0.1}>
                <div style={{ padding: '0 12px' }}>
                  {/* Number */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <span style={{
                      fontFamily: '"Instrument Serif", serif',
                      fontSize: '2.5rem',
                      color: '#d8d6d2',
                      fontWeight: 400,
                      lineHeight: 1,
                      marginBottom: 10,
                    }}>
                      {step.num}
                    </span>
                    {/* Dot */}
                    <div style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: '#0a0a0a',
                    }} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    color: '#0a0a0a',
                    marginBottom: 12,
                    lineHeight: 1.3,
                    textAlign: 'center',
                  }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '.84rem',
                    color: '#6b6b6b',
                    lineHeight: 1.75,
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'center',
                    margin: 0,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .process-line {
            display: none !important;
          }
        }
        @media (max-width: 500px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
