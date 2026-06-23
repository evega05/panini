import { useEffect, useState } from 'react'

interface ExitPopupProps {
  onClose?: () => void
}

const SESSION_KEY = 'provenza_exit_shown'

export default function ExitPopup({ onClose }: ExitPopupProps) {
  const [visible, setVisible] = useState(false)
  const [animIn, setAnimIn] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        sessionStorage.setItem(SESSION_KEY, '1')
        setVisible(true)
        requestAnimationFrame(() => setTimeout(() => setAnimIn(true), 20))
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 4000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const close = () => {
    setAnimIn(false)
    setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 280)
  }

  if (!visible) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) close() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 700,
        background: 'rgba(0,0,0,.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        opacity: animIn ? 1 : 0,
        transition: 'opacity .28s ease',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 24,
        maxWidth: 480,
        width: '100%',
        padding: 48,
        position: 'relative',
        transform: animIn ? 'translateY(0) scale(1)' : 'translateY(16px) scale(.97)',
        transition: 'transform .28s ease',
      }}>
        {/* Close */}
        <button
          onClick={close}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid #e8e6e2',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '.9rem',
            color: '#6b6b6b',
            transition: 'border-color .2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e6e2')}
        >
          ✕
        </button>

        {/* Kicker */}
        <p style={{
          fontSize: '.68rem',
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: '#6b6b6b',
          marginBottom: 12,
          fontFamily: 'Inter, sans-serif',
        }}>
          Antes de irte
        </p>

        {/* H2 */}
        <h2 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: '2rem',
          fontWeight: 400,
          color: '#0a0a0a',
          lineHeight: 1.15,
          marginBottom: 12,
        }}>
          ¿Te vas sin presupuesto?
        </h2>

        {/* Sub */}
        <p style={{
          fontSize: '.9rem',
          color: '#6b6b6b',
          lineHeight: 1.7,
          fontFamily: 'Inter, sans-serif',
          marginBottom: 32,
        }}>
          Es gratis, sin compromiso y te respondemos hoy mismo.
        </p>

        {/* CTA */}
        <a
          href="https://wa.me/34624118284"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            background: '#0a0a0a',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 10,
            padding: '15px 24px',
            fontSize: '.9rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: 16,
            transition: 'transform .2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
        >
          Escríbenos por WhatsApp
        </a>

        <p style={{
          textAlign: 'center',
          fontSize: '.78rem',
          color: '#6b6b6b',
          fontFamily: 'Inter, sans-serif',
          margin: 0,
        }}>
          O escríbenos al{' '}
          <a href="tel:+34624118284" style={{ color: '#0a0a0a', textDecoration: 'none', fontWeight: 500 }}>
            +34 624 118 284
          </a>
        </p>
      </div>
    </div>
  )
}
