import { useCounter } from '../../hooks/useCounter'

const STATS = [
  { target: 500, suffix: '+', label: 'Proyectos completados' },
  { target: 15, suffix: '+', label: 'Años de experiencia' },
  { target: 100, suffix: '%', label: 'Clientes satisfechos' },
  { target: 24, suffix: 'h', label: 'Respuesta garantizada' },
]

function StatBlock({ stat }: { stat: typeof STATS[0] }) {
  const { ref, count } = useCounter(stat.target, 1600)

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{
        fontFamily: '"Instrument Serif", serif',
        fontSize: 'clamp(3rem,6vw,7rem)',
        color: '#fff',
        fontWeight: 400,
        lineHeight: 1,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 4,
      }}>
        <span ref={ref as React.RefObject<HTMLSpanElement>}>{count}</span>
        <span style={{
          fontSize: 'clamp(1.5rem,2.5vw,3rem)',
          marginTop: '0.2em',
          color: 'rgba(255,255,255,.7)',
        }}>
          {stat.suffix}
        </span>
      </div>
      <p style={{
        fontSize: '.72rem',
        letterSpacing: '.2em',
        textTransform: 'uppercase',
        color: '#484848',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.6,
      }}>
        {stat.label}
      </p>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section style={{ background: '#0a0a0a' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid #1a1a1a',
          borderBottom: '1px solid #1a1a1a',
        }}
          className="stats-grid"
        >
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                borderRight: idx < STATS.length - 1 ? '1px solid #1a1a1a' : 'none',
              }}
            >
              <StatBlock stat={stat} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
