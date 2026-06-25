import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Cookies() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const resetConsent = () => {
    localStorage.removeItem('provenza_cookie_consent')
    window.location.reload()
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: '#0a0a0a', padding: '80px 48px 60px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#484848', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
            Legal
          </p>
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            Política de Cookies
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 48px' }}>
        <div style={{ fontSize: '.92rem', color: '#444', fontFamily: 'Inter, sans-serif', lineHeight: 1.85 }}>

          <Section title="¿Qué son las cookies?">
            <p>Las cookies son pequeños archivos de texto que los sitios web guardan en tu dispositivo cuando los visitas. Sirven para recordar preferencias, analizar el tráfico o personalizar contenido.</p>
          </Section>

          <Section title="Cookies que utiliza este sitio">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem', marginTop: 8 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e8e6e2' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#0a0a0a', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Cookie</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#0a0a0a', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Tipo</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#0a0a0a', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Finalidad</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#0a0a0a', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Duración</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'provenza_cookie_consent', tipo: 'Propia / Esencial', fin: 'Almacena tu elección sobre cookies', dur: 'Hasta que borres el almacenamiento local' },
                  { name: 'provenza_exit_shown', tipo: 'Propia / Funcional', fin: 'Evita mostrar el popup de salida más de una vez por sesión', dur: 'Sesión' },
                  { name: 'Google Maps (iframe)', tipo: 'Terceros / Analítica', fin: 'Renderiza el mapa interactivo de la zona de cobertura. Google puede instalar sus propias cookies.', dur: 'Según política de Google' },
                ].map(row => (
                  <tr key={row.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '.8rem', color: '#0a0a0a' }}>{row.name}</td>
                    <td style={{ padding: '12px' }}>{row.tipo}</td>
                    <td style={{ padding: '12px' }}>{row.fin}</td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>{row.dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Cookies de terceros">
            <p>El mapa de Google Maps integrado en este sitio puede instalar cookies de Google LLC. Para más información, consulta la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Política de privacidad de Google</a>.</p>
          </Section>

          <Section title="Cómo gestionar tus preferencias">
            <p>Puedes retirar tu consentimiento o cambiar tus preferencias en cualquier momento:</p>
            <button
              onClick={resetConsent}
              style={{
                background: '#0a0a0a',
                color: '#fff',
                border: 'none',
                borderRadius: 9999,
                padding: '11px 24px',
                fontSize: '.82rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: 12,
                display: 'inline-block',
              }}
            >
              Restablecer preferencias de cookies
            </button>
            <p style={{ marginTop: 20 }}>También puedes desactivar las cookies desde la configuración de tu navegador:</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" style={linkStyle}>Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={linkStyle}>Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" style={linkStyle}>Microsoft Edge</a></li>
            </ul>
          </Section>

          <Section title="Más información">
            <p>Para cualquier consulta sobre el uso de cookies, contacta con nosotros en <a href="mailto:inforeformasmiribilla@gmail.com" style={linkStyle}>inforeformasmiribilla@gmail.com</a>.</p>
          </Section>

        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e6e2' }}>
          <Link to="/" style={{ fontSize: '.82rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
          <span style={{ color: '#ccc', margin: '0 16px' }}>·</span>
          <Link to="/aviso-legal" style={{ fontSize: '.82rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>
            Aviso legal
          </Link>
          <span style={{ color: '#ccc', margin: '0 16px' }}>·</span>
          <Link to="/privacidad" style={{ fontSize: '.82rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>
            Política de privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}

const linkStyle: React.CSSProperties = { color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: 3 }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.35rem', fontWeight: 400, color: '#0a0a0a', marginBottom: 16, lineHeight: 1.3 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
