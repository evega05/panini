import { useEffect, useState } from 'react'

interface FloatingButtonsProps {
  onPresupuesto?: () => void
}

function isOpenNow(): boolean {
  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  const h = now.getHours()
  return h >= 8 && h < 19
}

type ChatMessage = { from: 'bot' | 'user'; text: string }

const INITIAL_MESSAGES: ChatMessage[] = [
  { from: 'bot', text: '¡Hola! 👋 ¿En qué podemos ayudarte hoy?' },
]

export default function FloatingButtons({ onPresupuesto }: FloatingButtonsProps) {
  const [showTop, setShowTop] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [badgeVisible, setBadgeVisible] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [online, setOnline] = useState(isOpenNow())

  useEffect(() => {
    const interval = setInterval(() => setOnline(isOpenNow()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleQuickReply = (option: string) => {
    setMessages(m => [...m, { from: 'user', text: option }])
    setTimeout(() => {
      if (option === '¿Cuánto tarda una reforma?') {
        setMessages(m => [...m, {
          from: 'bot',
          text: 'Una habitación tarda 1–2 semanas; una reforma completa entre 4 y 10 semanas. ¡Siempre te damos un calendario desde el primer día!'
        }])
      } else if (option === 'Quiero un presupuesto') {
        setMessages(m => [...m, { from: 'bot', text: 'Genial! Te redirigimos al formulario de presupuesto.' }])
        setTimeout(() => {
          setChatOpen(false)
          const el = document.getElementById('contacto')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
          onPresupuesto?.()
        }, 600)
      } else if (option === 'Hablar por WhatsApp') {
        window.open('https://wa.me/34624118284', '_blank', 'noopener')
      }
    }, 400)
  }

  const openChat = () => {
    setChatOpen(true)
    setBadgeVisible(false)
  }

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,.5); }
          50% { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
        }
        .wa-btn {
          animation: wa-pulse 2.4s ease infinite;
        }
        .wa-btn:hover {
          transform: scale(1.08) !important;
        }
        .chat-panel {
          transform-origin: bottom left;
        }
        .quick-reply-btn:hover {
          background: #f5f4f2 !important;
        }
      `}</style>

      {/* WhatsApp */}
      <a
        href="https://wa.me/34624118284"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        aria-label="WhatsApp"
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 600,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#25d366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform .2s ease',
          textDecoration: 'none',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Volver arriba"
          style={{
            position: 'fixed',
            bottom: 100,
            right: 34,
            zIndex: 600,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#0a0a0a',
            border: 'none',
            color: '#fff',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform .2s ease, box-shadow .2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,.25)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
        >
          ↑
        </button>
      )}

      {/* Chat widget */}
      <div style={{ position: 'fixed', bottom: 32, left: 32, zIndex: 600 }}>
        {/* Chat panel */}
        <div
          className="chat-panel"
          style={{
            position: 'absolute',
            bottom: 74,
            left: 0,
            width: 340,
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 24px 80px rgba(0,0,0,.18)',
            overflow: 'hidden',
            opacity: chatOpen ? 1 : 0,
            transform: chatOpen ? 'scale(1)' : 'scale(.9)',
            pointerEvents: chatOpen ? 'all' : 'none',
            transition: 'opacity .25s ease, transform .25s ease',
          }}
        >
          {/* Header */}
          <div style={{
            background: '#0a0a0a',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: '"Instrument Serif", serif',
              fontSize: '1.1rem',
              fontWeight: 400,
              flexShrink: 0,
            }}>
              P
            </div>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: '.88rem', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                Equipo Provenza
              </p>
              <p style={{ margin: 0, fontSize: '.72rem', color: online ? '#22c55e' : '#9ca3af', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: online ? '#22c55e' : '#9ca3af', display: 'inline-block' }} />
                {online ? 'En línea' : 'Lun–Vie 8–19h'}
              </p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,.5)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            padding: '20px 16px',
            maxHeight: 220,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end',
                }}
              >
                <span style={{
                  background: msg.from === 'bot' ? '#f5f4f2' : '#0a0a0a',
                  color: msg.from === 'bot' ? '#0a0a0a' : '#fff',
                  borderRadius: msg.from === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                  padding: '10px 14px',
                  fontSize: '.83rem',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.5,
                  maxWidth: '85%',
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div style={{
            padding: '0 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            borderTop: '1px solid #f0f0f0',
            paddingTop: 12,
          }}>
            {[
              'Quiero un presupuesto',
              '¿Cuánto tarda una reforma?',
              'Hablar por WhatsApp',
            ].map(opt => (
              <button
                key={opt}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(opt)}
                style={{
                  background: '#fff',
                  border: '1px solid #e8e6e2',
                  borderRadius: 9999,
                  padding: '9px 16px',
                  fontSize: '.78rem',
                  color: '#0a0a0a',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background .15s ease',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat trigger button */}
        <button
          onClick={openChat}
          aria-label="Abrir chat"
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#0a0a0a',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform .2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,.2)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
        >
          {chatOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}

          {/* Red badge */}
          {badgeVisible && !chatOpen && (
            <span style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '.65rem',
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              border: '2px solid #fff',
            }}>
              1
            </span>
          )}
        </button>
      </div>
    </>
  )
}
