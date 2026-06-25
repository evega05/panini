export default function ServiceMarquee() {
  const servicesText =
    'Reformas Integrales · Electricidad · Fontanería · Carpintería · Pintura · Albañilería · Climatización · Baños & Cocinas · Gran Bilbao · Desde 2009 · '

  const brandsText =
    'Roca · Grohe · Porcelanosa · Legrand · Schneider · Velux · Vaillant · Hansgrohe · Geberit · '

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 45s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-track-fast {
          display: flex;
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
        }
        .marquee-track-fast:hover {
          animation-play-state: paused;
        }
        .marquee-item:hover {
          color: #fff !important;
        }
        .brand-item:hover {
          color: rgba(255,255,255,.65) !important;
        }
      `}</style>

      {/* Bar 1 — Services */}
      <div
        style={{
          background: '#0a0a0a',
          padding: '18px 0',
          borderTop: '1px solid #1a1a1a',
          overflow: 'hidden',
        }}
      >
        <div className="marquee-track">
          {[servicesText, servicesText].map((text, idx) => (
            <span
              key={idx}
              className="marquee-item"
              style={{
                fontSize: '.72rem',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: '#484848',
                whiteSpace: 'nowrap',
                paddingRight: 0,
                fontFamily: 'Inter, sans-serif',
                cursor: 'default',
                transition: 'color .2s ease',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Bar 2 — Brands */}
      <div
        style={{
          background: '#0a0a0a',
          padding: '40px 0 36px',
          overflow: 'hidden',
        }}
      >
        <p
          style={{
            fontSize: '.68rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#484848',
            textAlign: 'center',
            marginBottom: 20,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          TRABAJAMOS CON
        </p>
        <div className="marquee-track-fast">
          {[brandsText, brandsText].map((text, idx) => (
            <span
              key={idx}
              className="brand-item"
              style={{
                fontSize: '.88rem',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.18)',
                whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
                cursor: 'default',
                transition: 'color .2s ease',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
