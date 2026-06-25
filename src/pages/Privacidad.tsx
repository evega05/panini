import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Privacidad() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: '#0a0a0a', padding: '80px 48px 60px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#484848', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
            Legal
          </p>
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            Política de Privacidad
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 48px' }}>
        <div style={{ fontSize: '.92rem', color: '#444', fontFamily: 'Inter, sans-serif', lineHeight: 1.85 }}>

          <Section title="1. Responsable del tratamiento">
            <ul>
              <li><strong>Denominación:</strong> Multiservicios Provenza</li>
              <li><strong>Dirección:</strong> Bilbao, Bizkaia (España)</li>
              <li><strong>Contacto:</strong> <a href="mailto:inforeformasmiribilla@gmail.com" style={linkStyle}>inforeformasmiribilla@gmail.com</a></li>
            </ul>
          </Section>

          <Section title="2. Datos que recopilamos">
            <p>Recopilamos únicamente los datos que tú nos facilitas voluntariamente a través de los formularios de contacto del sitio web:</p>
            <ul>
              <li>Nombre y apellidos</li>
              <li>Número de teléfono</li>
              <li>Correo electrónico (opcional)</li>
              <li>Descripción del servicio solicitado</li>
            </ul>
            <p>Estos datos se transmiten directamente a través de WhatsApp y no son almacenados en ningún servidor propio.</p>
          </Section>

          <Section title="3. Finalidad del tratamiento">
            <p>Los datos facilitados se utilizan exclusivamente para:</p>
            <ul>
              <li>Atender tu solicitud de presupuesto o consulta</li>
              <li>Contactarte para coordinar visitas o presupuestos</li>
              <li>Gestionar la relación comercial en caso de contratación</li>
            </ul>
          </Section>

          <Section title="4. Base jurídica">
            <p>El tratamiento de tus datos se basa en el consentimiento expreso que otorgas al enviar el formulario de contacto (art. 6.1.a RGPD) y en el interés legítimo de atender solicitudes de información (art. 6.1.f RGPD).</p>
          </Section>

          <Section title="5. Conservación de los datos">
            <p>Los datos se conservan durante el tiempo necesario para gestionar tu solicitud y, en caso de contratación, durante el plazo legal establecido (mínimo 5 años conforme a la normativa mercantil española).</p>
          </Section>

          <Section title="6. Destinatarios">
            <p>No cedemos tus datos a terceros, salvo obligación legal. Los datos enviados a través de WhatsApp están sujetos a la <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>política de privacidad de WhatsApp/Meta</a>.</p>
          </Section>

          <Section title="7. Tus derechos">
            <p>En cualquier momento puedes ejercer los siguientes derechos enviando un correo a <a href="mailto:inforeformasmiribilla@gmail.com" style={linkStyle}>inforeformasmiribilla@gmail.com</a>:</p>
            <ul>
              <li><strong>Acceso:</strong> conocer qué datos tuyos tenemos</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos</li>
              <li><strong>Supresión:</strong> solicitar que eliminemos tus datos</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en formato electrónico</li>
              <li><strong>Limitación:</strong> restringir el tratamiento en determinadas circunstancias</li>
            </ul>
            <p>También tienes derecho a presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={linkStyle}>Agencia Española de Protección de Datos (AEPD)</a>.</p>
          </Section>

          <Section title="8. Seguridad">
            <p>Adoptamos las medidas técnicas y organizativas necesarias para proteger tus datos contra accesos no autorizados, pérdida o alteración, de conformidad con el RGPD y la LOPDGDD.</p>
          </Section>

          <Section title="9. Modificaciones">
            <p>Esta política puede actualizarse para adaptarse a cambios normativos o de actividad. La versión vigente siempre estará disponible en esta página.</p>
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
