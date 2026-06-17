import { useEffect, useRef, useState, useCallback } from 'react'

const TICKER_MESSAGES = [
  '500+ Proyectos completados',
  '15+ Años de experiencia',
  '24h Respuesta garantizada',
  '100% Clientes satisfechos',
]

interface HeroProps {
  onPresupuesto: () => void
}

export default function Hero({ onPresupuesto }: HeroProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [parallaxY, setParallaxY] = useState(0)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [tickerVisible, setTickerVisible] = useState(true)
  const animFrameRef = useRef<number | null>(null)
  const tickerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleScroll = useCallback(() => {
    const y = window.scrollY
    if (y < window.innerHeight) {
      setParallaxY(y)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [handleScroll])

  useEffect(() => {
    tickerIntervalRef.current = setInterval(() => {
      setTickerVisible(false)
      setTimeout(() => {
        setTickerIndex(i => (i + 1) % TICKER_MESSAGES.length)
        setTickerVisible(true)
      }, 380)
    }, 3000)
    return () => {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current)
    }
  }, [])

  const scrollToServices = () => {
    const el = document.getElementById('servicios')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @keyframes sdrop {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(54px); opacity: 0; }
        }
        .scroll-line-inner {
          animation: sdrop 1.6s ease-in-out infinite;
        }
      `}</style>

      <section
        style={{
          position: 'relative',
          height: '100svh',
          minHeight: 640,
          padding: '0 48px 88px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {/* Background image with parallax */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90"
          alt=""
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '120%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: `translateY(${parallaxY * 0.28}px)`,
            opacity: imgLoaded ? 1 : 0,
            transition: imgLoaded ? 'opacity .8s ease' : 'none',
            zIndex: 0,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.38) 42%, rgba(0,0,0,.12) 70%, rgba(0,0,0,.22) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {/* Kicker */}
          <p
            style={{
              color: 'rgba(255,255,255,.45)',
              fontSize: '.72rem',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              marginBottom: 28,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Gran Bilbao · Fundada 2009
          </p>

          {/* Ticker */}
          <div
            style={{
              marginBottom: 28,
              height: 28,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,.7)',
                fontSize: '.82rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                opacity: tickerVisible ? 1 : 0,
                transform: tickerVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity .38s ease, transform .38s ease',
                display: 'inline-block',
              }}
            >
              {TICKER_MESSAGES[tickerIndex]}
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 'clamp(3rem,7.5vw,8.8rem)',
              lineHeight: 0.93,
              color: '#fff',
              fontWeight: 400,
              margin: '0 0 44px',
              maxWidth: 900,
            }}
          >
            Reformamos espacios,
            <br />
            <em style={{ color: 'rgba(255,255,255,.45)', fontStyle: 'italic' }}>
              construimos hogares.
            </em>
          </h1>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={onPresupuesto}
              style={{
                background: '#fff',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: 9999,
                padding: '14px 32px',
                fontSize: '.88rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '.02em',
                transition: 'transform .2s ease, box-shadow .2s ease',
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                t.style.transform = 'translateY(-2px)'
                t.style.boxShadow = '0 8px 32px rgba(0,0,0,.25)'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                t.style.transform = 'none'
                t.style.boxShadow = 'none'
              }}
            >
              Solicitar Presupuesto
            </button>
            <button
              onClick={scrollToServices}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.45)',
                borderRadius: 9999,
                padding: '14px 32px',
                fontSize: '.88rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                cursor: 'pointer',
                letterSpacing: '.02em',
                transition: 'border-color .2s ease, background .2s ease',
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(255,255,255,.8)'
                t.style.background = 'rgba(255,255,255,.08)'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(255,255,255,.45)'
                t.style.background = 'transparent'
              }}
            >
              Ver Servicios
            </button>
          </div>
        </div>

        {/* Scroll indicator — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 88,
            right: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 1,
              height: 60,
              background: 'rgba(255,255,255,.2)',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 1,
            }}
          >
            <div
              className="scroll-line-inner"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '40%',
                background: '#fff',
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
