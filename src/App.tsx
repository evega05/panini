import { useEffect, useRef } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tick = () => {
      if (video.duration && !video.paused && !video.ended) {
        const t = video.currentTime
        const d = video.duration
        const fade = 0.5
        if (t < fade) {
          video.style.opacity = String(t / fade)
        } else if (d - t < fade) {
          video.style.opacity = String(Math.max(0, (d - t) / fade))
        } else {
          video.style.opacity = '1'
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
      }, 100)
    }

    rafRef.current = requestAnimationFrame(tick)
    video.addEventListener('ended', handleEnded)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div
      className="absolute z-0"
      style={{ inset: 'auto 0 0 0', top: '300px' }}
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover block"
        style={{ opacity: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
    </div>
  )
}

const NAV_ITEMS = ['Home', 'Studio', 'About', 'Journal', 'Reach Us'] as const

function Navbar() {
  return (
    <nav className="relative z-10 w-full px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a
          href="/"
          className="no-underline text-3xl tracking-tight text-black"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Aethera<sup>®</sup>
        </a>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                href="#"
                className={`text-sm transition-colors no-underline hover:opacity-80 ${
                  item === 'Home' ? 'text-black' : 'text-[#6F6F6F]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="rounded-full px-6 py-2.5 text-sm bg-black text-white transition-transform hover:scale-[1.03] cursor-pointer border-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Begin Journey
        </button>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section
      className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
      style={{ paddingTop: 'calc(8rem - 75px)' }}
    >
      <h1
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl font-normal max-w-7xl m-0"
        style={{
          fontFamily: "'Instrument Serif', serif",
          lineHeight: 0.95,
          letterSpacing: '-2.46px',
          color: '#000000',
        }}
      >
        Beyond{' '}
        <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>silence,</em>
        {' '}we build{' '}
        <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>the eternal.</em>
      </h1>

      <p
        className="animate-fade-rise-delay text-base sm:text-lg max-w-2xl mt-8 leading-relaxed m-0"
        style={{ color: '#6F6F6F', fontFamily: "'Inter', sans-serif" }}
      >
        Building platforms for brilliant minds, fearless makers, and thoughtful
        souls. Through the noise, we craft digital havens for deep work and pure
        flows.
      </p>

      <button
        className="animate-fade-rise-delay-2 rounded-full px-14 py-5 text-base mt-12 bg-black text-white transition-transform hover:scale-[1.03] cursor-pointer border-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Begin Journey
      </button>
    </section>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <VideoBackground />
      <Navbar />
      <HeroSection />
    </div>
  )
}
