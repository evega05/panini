import { useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'provenza_cookie_consent'

export function useCookieConsent() {
  return localStorage.getItem(STORAGE_KEY)
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#0a0a0a',
        borderTop: '1px solid #1a1a1a',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <p style={{
        fontSize: '.82rem',
        color: '#9ca3af',
        fontFamily: 'Inter, sans-serif',
        margin: 0,
        flex: 1,
        minWidth: 260,
        lineHeight: 1.6,
      }}>
        Usamos cookies propias y de terceros (Google Maps) para mejorar tu experiencia.{' '}
        <Link
          to="/cookies"
          style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          Política de cookies
        </Link>
        {' '}·{' '}
        <Link
          to="/privacidad"
          style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          Privacidad
        </Link>
      </p>

      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            borderRadius: 9999,
            padding: '9px 20px',
            fontSize: '.78rem',
            color: '#9ca3af',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            transition: 'border-color .2s ease, color .2s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#6b6b6b'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#333'
            e.currentTarget.style.color = '#9ca3af'
          }}
        >
          Solo esenciales
        </button>
        <button
          onClick={accept}
          style={{
            background: '#fff',
            border: '1px solid #fff',
            borderRadius: 9999,
            padding: '9px 20px',
            fontSize: '.78rem',
            color: '#0a0a0a',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background .2s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e5e5e5')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
        >
          Aceptar todas
        </button>
      </div>
    </div>
  )
}
