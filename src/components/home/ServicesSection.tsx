import { useState, useRef } from 'react'
import { Reveal } from '../../hooks/useReveal'

const SERVICES = [
  'Reformas Integrales',
  'Instalaciones Eléctricas',
  'Fontanería',
  'Carpintería',
  'Pintura',
  'Albañilería',
  'Climatización',
  'Baños & Cocinas',
]

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=840&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=840&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=840&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=840&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=840&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=840&q=80',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=840&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=840&q=80',
]

interface ServicesSectionProps {
  onPresupuesto: () => void
}

export default function ServicesSection({ onPresupuesto }: ServicesSectionProps) {
  const [hoveredIdx, setHoveredIdx] = useState(0)
  const [imgSrc, setImgSrc] = useState(SERVICE_IMAGES[0])
  const [imgOpacity, setImgOpacity] = useState(1)
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHover = (idx: number) => {
    setHoveredIdx(idx)
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    setImgOpacity(0)
    fadeTimeout.current = setTimeout(() => {
      setImgSrc(SERVICE_IMAGES[idx])
      setImgOpacity(1)
    }, 180)
  }

  return (
    <>
      <style>{`
        .service-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 0;
          cursor: pointer;
          border-top: 1px solid #e8e6e2;
          transition: padding-left .28s ease;
          gap: 16px;
        }
        .service-row:last-child {
          border-bottom: 1px solid #e8e6e2;
        }
        .service-row:hover {
          padding-left: 14px;
        }
        .service-row:hover .svc-arrow {
          transform: translateX(6px);
        }
        .svc-arrow {
          transition: transform .28s ease;
          color: #6b6b6b;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        @media (max-width: 1099px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
          .services-img-panel {
            display: none !important;
          }
        }
      `}</style>

      <section
        id="servicios"
        style={{ background: '#fff', padding: '120px 0' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          {/* Header */}
          <Reveal>
            <p style={{
              fontSize: '.72rem',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: '#6b6b6b',
              marginBottom: 14,
              fontFamily: 'Inter, sans-serif',
            }}>
              Lo que hacemos
            </p>
            <h2 style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 'clamp(2.2rem,4.5vw,4.5rem)',
              fontWeight: 400,
              color: '#0a0a0a',
              lineHeight: 1.08,
              marginBottom: 64,
            }}>
              Servicios{' '}
              <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>a tu medida</em>
            </h2>
          </Reveal>

          {/* Grid */}
          <div
            className="services-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 420px',
              gap: 80,
              alignItems: 'start',
            }}
          >
            {/* Left — list */}
            <div>
              {SERVICES.map((svc, idx) => (
                <Reveal key={svc} delay={idx * 0.04}>
                  <div
                    className="service-row"
                    onMouseEnter={() => handleHover(idx)}
                    onClick={onPresupuesto}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onPresupuesto()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: '.68rem',
                        color: '#ccc',
                        fontFamily: 'Inter, sans-serif',
                        minWidth: 22,
                        letterSpacing: '.04em',
                      }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span style={{
                        fontFamily: '"Instrument Serif", serif',
                        fontSize: 'clamp(1.3rem,2.2vw,2.1rem)',
                        color: hoveredIdx === idx ? '#0a0a0a' : '#0a0a0a',
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}>
                        {svc}
                      </span>
                    </div>
                    <span className="svc-arrow">→</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Right — sticky image */}
            <div
              className="services-img-panel"
              style={{
                position: 'sticky',
                top: 96,
                height: 520,
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,.12)',
              }}
            >
              <img
                src={imgSrc}
                alt="Servicio"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imgOpacity,
                  transition: 'opacity .18s ease',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
