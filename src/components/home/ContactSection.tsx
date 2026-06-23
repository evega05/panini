import { useState, useEffect } from 'react'
import { Reveal } from '../../hooks/useReveal'

const SERVICES_LIST = [
  'Reformas Integrales',
  'Electricidad',
  'Fontanería',
  'Carpintería',
  'Pintura',
  'Albañilería',
  'Climatización',
  'Baños & Cocinas',
]

const MORNING_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00']
const AFTERNOON_SLOTS = ['15:00', '16:00', '17:00', '18:00']

function isOpenNow(): boolean {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return false
  const h = now.getHours()
  return h >= 8 && h < 19
}

function TrustBadge({ text }: { text: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 9999,
      padding: '7px 14px',
      fontSize: '.75rem',
      color: 'rgba(255,255,255,.6)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {text}
    </span>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 10,
  padding: '13px 16px',
  fontSize: '.88rem',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .2s ease',
}

interface ContactSectionProps {
  onPresupuesto: () => void
}

export default function ContactSection({ onPresupuesto: _onPresupuesto }: ContactSectionProps) {
  const [activeTab, setActiveTab] = useState<'consulta' | 'visita'>('consulta')
  const [open, setOpen] = useState(isOpenNow())
  const today = new Date().toISOString().split('T')[0]

  // Form states
  const [consulta, setConsulta] = useState({
    nombre: '', telefono: '', email: '', servicio: '', mensaje: '',
  })
  const [visita, setVisita] = useState({
    fecha: '', hora: '', nombre: '', telefono: '',
  })

  useEffect(() => {
    const interval = setInterval(() => setOpen(isOpenNow()), 60000)
    return () => clearInterval(interval)
  }, [])

  const handleConsultaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consulta.nombre || !consulta.telefono) return
    const lineas = [
      `Hola, me interesa solicitar un presupuesto.`,
      `Nombre: ${consulta.nombre}`,
      `Teléfono: ${consulta.telefono}`,
      consulta.email ? `Email: ${consulta.email}` : '',
      consulta.servicio ? `Servicio: ${consulta.servicio}` : '',
      consulta.mensaje ? `Mensaje: ${consulta.mensaje}` : '',
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/34624118284?text=${encodeURIComponent(lineas)}`, '_blank', 'noopener')
  }

  const handleVisitaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!visita.nombre || !visita.telefono || !visita.fecha || !visita.hora) return
    const msg = encodeURIComponent(
      `Hola! Quiero reservar una visita.\nNombre: ${visita.nombre}\nTeléfono: ${visita.telefono}\nFecha: ${visita.fecha}\nHora: ${visita.hora}`
    )
    window.open(`https://wa.me/34624118284?text=${msg}`, '_blank', 'noopener')
  }

  const tabStyle = (tab: 'consulta' | 'visita'): React.CSSProperties => ({
    padding: '10px 22px',
    borderRadius: 9999,
    border: 'none',
    cursor: 'pointer',
    fontSize: '.82rem',
    fontFamily: 'Inter, sans-serif',
    transition: 'background .2s ease, color .2s ease',
    background: activeTab === tab ? 'rgba(255,255,255,.1)' : 'transparent',
    color: activeTab === tab ? '#fff' : '#6b6b6b',
    fontWeight: activeTab === tab ? 500 : 400,
  })

  return (
    <section id="contacto" style={{ background: '#0a0a0a', padding: '120px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'start',
          }}
        >
          {/* LEFT */}
          <Reveal>
            <div>
              <p style={{
                fontSize: '.72rem',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#484848',
                marginBottom: 14,
                fontFamily: 'Inter, sans-serif',
              }}>
                Contacto
              </p>
              <h2 style={{
                fontFamily: '"Instrument Serif", serif',
                fontSize: 'clamp(2rem,4vw,4rem)',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: 20,
              }}>
                Cuéntanos tu{' '}
                <em style={{ color: 'rgba(255,255,255,.35)', fontStyle: 'italic' }}>proyecto</em>
              </h2>
              <p style={{
                fontSize: '.9rem',
                color: '#6b6b6b',
                lineHeight: 1.75,
                fontFamily: 'Inter, sans-serif',
                marginBottom: 40,
              }}>
                Recibe un presupuesto gratuito y sin compromiso. Te respondemos en
                menos de 24 horas y nos desplazamos a tu domicilio sin coste.
              </p>

              {/* Contact details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 36 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '.68rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#484848', fontFamily: 'Inter, sans-serif' }}>
                    Teléfono
                  </p>
                  <a
                    href="tel:+34624118284"
                    style={{
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '1.05rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      transition: 'color .2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#22c55e')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                  >
                    +34 624 118 284
                  </a>
                </div>

                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '.68rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#484848', fontFamily: 'Inter, sans-serif' }}>
                    Email
                  </p>
                  <a
                    href="mailto:inforeformasmiribilla@gmail.com"
                    style={{ color: '#fff', textDecoration: 'none', fontSize: '.92rem', fontFamily: 'Inter, sans-serif', transition: 'color .2s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#22c55e')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                  >
                    inforeformasmiribilla@gmail.com
                  </a>
                </div>

                <div>
                  <p style={{ margin: '0 0 6px', fontSize: '.68rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#484848', fontFamily: 'Inter, sans-serif' }}>
                    Horario
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '.88rem', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                      Lun – Vie 8:00 – 19:00
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      background: open ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)',
                      borderRadius: 9999,
                      padding: '3px 10px',
                      fontSize: '.7rem',
                      color: open ? '#22c55e' : '#ef4444',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: open ? '#22c55e' : '#ef4444',
                        display: 'inline-block',
                      }} />
                      {open ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <TrustBadge text="Seguro RC Profesional" />
                <TrustBadge text="Desde 2009" />
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Form */}
          <Reveal delay={0.1}>
            <div style={{
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 20,
              padding: 36,
            }}>
              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: 4,
                background: 'rgba(255,255,255,.04)',
                borderRadius: 9999,
                padding: 4,
                marginBottom: 28,
              }}>
                <button style={tabStyle('consulta')} onClick={() => setActiveTab('consulta')}>
                  Consulta rápida
                </button>
                <button style={tabStyle('visita')} onClick={() => setActiveTab('visita')}>
                  Reservar visita
                </button>
              </div>

              {activeTab === 'consulta' ? (
                <form onSubmit={handleConsultaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <input
                      required
                      style={inputStyle}
                      placeholder="Nombre *"
                      value={consulta.nombre}
                      onChange={e => setConsulta(p => ({ ...p, nombre: e.target.value }))}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                    />
                    <input
                      required
                      style={inputStyle}
                      placeholder="Teléfono *"
                      type="tel"
                      value={consulta.telefono}
                      onChange={e => setConsulta(p => ({ ...p, telefono: e.target.value }))}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                    />
                  </div>
                  <input
                    style={inputStyle}
                    placeholder="Email"
                    type="email"
                    value={consulta.email}
                    onChange={e => setConsulta(p => ({ ...p, email: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                  />
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={consulta.servicio}
                    onChange={e => setConsulta(p => ({ ...p, servicio: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                  >
                    <option value="" style={{ background: '#0a0a0a' }}>Tipo de servicio</option>
                    {SERVICES_LIST.map(s => (
                      <option key={s} value={s} style={{ background: '#0a0a0a' }}>{s}</option>
                    ))}
                  </select>
                  <textarea
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                    placeholder="Cuéntanos tu proyecto..."
                    value={consulta.mensaje}
                    onChange={e => setConsulta(p => ({ ...p, mensaje: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#25d366',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '14px',
                      fontSize: '.88rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'transform .2s ease',
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Solicitar presupuesto por WhatsApp
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVisitaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input
                    type="date"
                    min={today}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    value={visita.fecha}
                    onChange={e => setVisita(p => ({ ...p, fecha: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                  />
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={visita.hora}
                    onChange={e => setVisita(p => ({ ...p, hora: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                  >
                    <option value="" style={{ background: '#0a0a0a' }}>Franja horaria</option>
                    <optgroup label="Mañana" style={{ background: '#0a0a0a' }}>
                      {MORNING_SLOTS.map(h => (
                        <option key={h} value={h} style={{ background: '#0a0a0a' }}>{h}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Tarde" style={{ background: '#0a0a0a' }}>
                      {AFTERNOON_SLOTS.map(h => (
                        <option key={h} value={h} style={{ background: '#0a0a0a' }}>{h}</option>
                      ))}
                    </optgroup>
                  </select>
                  <input
                    required
                    style={inputStyle}
                    placeholder="Nombre *"
                    value={visita.nombre}
                    onChange={e => setVisita(p => ({ ...p, nombre: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                  />
                  <input
                    required
                    style={inputStyle}
                    placeholder="Teléfono *"
                    type="tel"
                    value={visita.telefono}
                    onChange={e => setVisita(p => ({ ...p, telefono: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#25d366',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '14px',
                      fontSize: '.88rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'transform .2s ease',
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Confirmar por WhatsApp
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        input::placeholder, textarea::placeholder, select::placeholder {
          color: #484848;
        }
      `}</style>
    </section>
  )
}
