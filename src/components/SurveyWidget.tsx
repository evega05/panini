import { useState } from 'react'

interface SurveyWidgetProps {
  onPresupuesto: () => void
}

const OPTIONS = [
  { emoji: '🛁', label: 'Baño' },
  { emoji: '🍳', label: 'Cocina' },
  { emoji: '🏠', label: 'Piso completo' },
  { emoji: '🔧', label: 'Otra reforma' },
]

export default function SurveyWidget({ onPresupuesto }: SurveyWidgetProps) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .survey-widget { display: none !important; }
        }
        .survey-option-btn:hover {
          border-color: #0a0a0a !important;
          background: #f5f4f2 !important;
        }
      `}</style>

      <div
        className="survey-widget"
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 500,
        }}
      >
        {/* Expanded panel */}
        {open && (
          <div style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,.15)',
            padding: '28px 24px 20px',
            width: 320,
            marginBottom: 10,
            position: 'relative',
          }}>
            {/* Close */}
            <button
              onClick={() => setDismissed(true)}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #e8e6e2',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '.8rem',
                color: '#6b6b6b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e6e2')}
            >
              ✕
            </button>

            <p style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: '1.05rem',
              color: '#0a0a0a',
              marginBottom: 18,
              fontWeight: 400,
              lineHeight: 1.3,
            }}>
              ¿Qué reforma necesitas?
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}>
              {OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  className="survey-option-btn"
                  onClick={() => {
                    setOpen(false)
                    setDismissed(true)
                    onPresupuesto()
                  }}
                  style={{
                    border: '1px solid #e8e6e2',
                    borderRadius: 14,
                    padding: '16px 12px',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'border-color .15s ease, background .15s ease',
                  }}
                >
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{opt.emoji}</span>
                  <span style={{
                    fontSize: '.78rem',
                    color: '#0a0a0a',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    textAlign: 'center',
                  }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab trigger */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: 9999,
              padding: '12px 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,.12)',
              cursor: 'pointer',
              fontSize: '.84rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'transform .2s ease, box-shadow .2s ease',
            }}
            onMouseEnter={e => {
              const t = e.currentTarget
              t.style.transform = 'translateY(-2px)'
              t.style.boxShadow = '0 12px 40px rgba(0,0,0,.16)'
            }}
            onMouseLeave={e => {
              const t = e.currentTarget
              t.style.transform = 'none'
              t.style.boxShadow = '0 8px 32px rgba(0,0,0,.12)'
            }}
          >
            ¿Qué reforma necesitas?
            <span style={{ fontSize: '.75rem', opacity: .6 }}>→</span>
          </button>
        )}
      </div>
    </>
  )
}
