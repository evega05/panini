import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../../hooks/useReveal'

const PROJECTS = [
  { label: 'Piso completo en Bilbao (Indautxu)', pct: 82 },
  { label: 'Reforma de cocina en Getxo', pct: 55 },
  { label: 'Baño + habitación en Barakaldo', pct: 30 },
]

function ProgressBar({ pct, active }: { pct: number; active: boolean }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (active) {
      const raf = requestAnimationFrame(() => {
        setTimeout(() => setWidth(pct), 60)
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [active, pct])

  return (
    <div style={{
      height: 6,
      background: '#1e1e1e',
      borderRadius: 9999,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        background: 'linear-gradient(90deg, #22c55e, #4ade80)',
        borderRadius: 9999,
        transition: 'width 1.2s cubic-bezier(.22,.68,0,1.2)',
      }} />
    </div>
  )
}

export default function ProgressSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#0a0a0a', padding: '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <Reveal>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 0 3px rgba(34,197,94,.25), 0 0 0 6px rgba(34,197,94,.1)',
              animation: 'pulse-green 2s ease infinite',
              flexShrink: 0,
            }} />
            <h2 style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 'clamp(1.6rem,3.2vw,3rem)',
              color: '#fff',
              fontWeight: 400,
              margin: 0,
            }}>
              Proyectos en curso
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {PROJECTS.map((project, idx) => (
            <Reveal key={project.label} delay={idx * 0.1}>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 14,
                  gap: 16,
                }}>
                  <p style={{
                    fontSize: '.9rem',
                    color: '#ccc',
                    fontFamily: 'Inter, sans-serif',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {project.label}
                  </p>
                  <span style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: '1.5rem',
                    color: '#fff',
                    fontWeight: 400,
                    flexShrink: 0,
                  }}>
                    {project.pct}%
                  </span>
                </div>
                <ProgressBar pct={project.pct} active={inView} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,.25), 0 0 0 6px rgba(34,197,94,.1); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,.35), 0 0 0 10px rgba(34,197,94,.08); }
        }
      `}</style>
    </section>
  )
}
