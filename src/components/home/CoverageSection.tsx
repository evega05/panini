import { Reveal } from '../../hooks/useReveal'

const ZONES = [
  'Bilbao', 'Barakaldo', 'Getxo', 'Basauri', 'Leioa', 'Santurtzi',
  'Portugalete', 'Sestao', 'Galdakao', 'Erandio', 'Durango', 'Amorebieta',
]

export default function CoverageSection() {
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
            Zona de cobertura
          </p>
          <h2 style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(2.2rem,4.5vw,4.5rem)',
            fontWeight: 400,
            color: '#0a0a0a',
            lineHeight: 1.08,
            marginBottom: 20,
          }}>
            Actuamos en todo{' '}
            <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>el Gran Bilbao</em>
          </h2>

          {/* Zone chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 48,
          }}>
            {ZONES.map(zone => (
              <span
                key={zone}
                style={{
                  border: '1px solid #e8e6e2',
                  borderRadius: 9999,
                  padding: '8px 22px',
                  fontSize: '.78rem',
                  color: '#6b6b6b',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'default',
                  transition: 'border-color .2s ease, color .2s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#0a0a0a'
                  el.style.color = '#0a0a0a'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e8e6e2'
                  el.style.color = '#6b6b6b'
                }}
              >
                {zone}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Map */}
        <Reveal delay={0.1}>
          <div style={{
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 16px 64px rgba(0,0,0,.07)',
            height: 460,
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93516.48232693024!2d-3.0097!3d43.2630!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4e50e8b7a10001%3A0x30fc36d3c62bb710!2sBilbao%2C%20Bizkaia!5e0!3m2!1ses!2ses!4v1680000000000!5m2!1ses!2ses"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zona de cobertura Gran Bilbao"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
