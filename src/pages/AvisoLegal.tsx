import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AvisoLegal() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#0a0a0a', padding: '80px 48px 60px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#484848', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
            Legal
          </p>
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            Aviso Legal
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 48px' }}>
        <div style={{ fontSize: '.92rem', color: '#444', fontFamily: 'Inter, sans-serif', lineHeight: 1.85 }}>

          <Section title="1. Identificación del titular">
            <p>En cumplimiento de lo establecido en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos de identificación:</p>
            <ul>
              <li><strong>Denominación social:</strong> Multiservicios Provenza</li>
              <li><strong>Actividad:</strong> Reformas integrales e instalaciones</li>
              <li><strong>Domicilio:</strong> Bilbao, Bizkaia (España)</li>
              <li><strong>Teléfono:</strong> <a href="tel:+34624118284" style={linkStyle}>+34 624 118 284</a></li>
              <li><strong>Correo electrónico:</strong> <a href="mailto:inforeformasmiribilla@gmail.com" style={linkStyle}>inforeformasmiribilla@gmail.com</a></li>
              <li><strong>Registro:</strong> Nº BI-2009-1284 · Registro de Empresas Instaladoras de Bizkaia</li>
            </ul>
          </Section>

          <Section title="2. Objeto y ámbito de aplicación">
            <p>El presente Aviso Legal regula el acceso y uso del sitio web de Multiservicios Provenza. El mero acceso al sitio implica la aceptación plena de las condiciones aquí recogidas.</p>
          </Section>

          <Section title="3. Propiedad intelectual e industrial">
            <p>Todos los contenidos del sitio web (textos, imágenes, diseño, logotipos, código fuente) son propiedad de Multiservicios Provenza o de terceros que han autorizado su uso, y están protegidos por la normativa española e internacional de propiedad intelectual e industrial.</p>
            <p>Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa del titular.</p>
          </Section>

          <Section title="4. Exclusión de responsabilidad">
            <p>Multiservicios Provenza no se responsabiliza de los daños derivados de interrupciones, errores técnicos o accesos no autorizados al sitio web, ni del uso que terceros puedan hacer de los contenidos publicados.</p>
            <p>Los enlaces a sitios externos (WhatsApp, Google Maps) son responsabilidad de sus respectivos titulares.</p>
          </Section>

          <Section title="5. Legislación aplicable y jurisdicción">
            <p>Este Aviso Legal se rige por la legislación española. Para cualquier controversia derivada del uso del sitio, las partes se someten a los Juzgados y Tribunales de Bilbao, con renuncia expresa a cualquier otro fuero.</p>
          </Section>

          <Section title="6. Modificaciones">
            <p>Multiservicios Provenza se reserva el derecho a modificar el presente Aviso Legal en cualquier momento. Los cambios serán efectivos desde su publicación en el sitio web.</p>
          </Section>

        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e6e2' }}>
          <Link to="/" style={{ fontSize: '.82rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
          <span style={{ color: '#ccc', margin: '0 16px' }}>·</span>
          <Link to="/privacidad" style={{ fontSize: '.82rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>
            Política de privacidad
          </Link>
          <span style={{ color: '#ccc', margin: '0 16px' }}>·</span>
          <Link to="/cookies" style={{ fontSize: '.82rem', color: '#6b6b6b', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>
            Política de cookies
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
