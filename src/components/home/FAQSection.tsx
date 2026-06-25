import { useState, useRef } from 'react'
import { Reveal } from '../../hooks/useReveal'

const FAQS = [
  {
    q: '¿Dais presupuesto sin coste?',
    a: 'Sí. La visita al domicilio y la elaboración del presupuesto son completamente gratuitas y sin compromiso. Nos ponemos en contacto contigo en menos de 24 horas tras la visita.',
  },
  {
    q: '¿Cuánto tarda una reforma integral?',
    a: 'Depende del alcance. Una habitación puede tardar entre 1 y 2 semanas, mientras que una reforma completa de vivienda puede llevar entre 4 y 10 semanas. Te damos un calendario realista desde el primer día.',
  },
  {
    q: '¿Trabajáis con materiales que yo aporte?',
    a: 'Sí. Podemos trabajar con materiales que el cliente aporte. También asesoramos en la selección de proveedores y materiales de calidad si prefieres que nos ocupemos de todo.',
  },
  {
    q: '¿Tenéis seguro de responsabilidad civil?',
    a: 'Sí. Disponemos de seguro de responsabilidad civil para todos nuestros trabajos. Tu hogar está protegido durante toda la reforma.',
  },
  {
    q: '¿Emitís factura con IVA?',
    a: 'Por supuesto. Todos los trabajos se facturan con IVA incluido. Trabajamos siempre en regla y de forma transparente.',
  },
]

function FAQItem({ faq, isLast }: { faq: typeof FAQS[0]; isLast: boolean }) {
  const [open, setOpen] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{
      borderTop: '1px solid #d8d6d2',
      borderBottom: isLast ? '1px solid #d8d6d2' : 'none',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: '.95rem',
          color: '#0a0a0a',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          lineHeight: 1.4,
          flex: 1,
        }}>
          {faq.q}
        </span>
        <span style={{
          width: 28,
          height: 28,
          border: '1px solid #d8d6d2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          color: '#6b6b6b',
          flexShrink: 0,
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform .25s ease',
          fontWeight: 300,
          lineHeight: 1,
        }}>
          +
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? (answerRef.current?.scrollHeight ?? 400) + 'px' : '0',
          overflow: 'hidden',
          transition: 'max-height .35s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div ref={answerRef} style={{ paddingBottom: 22 }}>
          <p style={{
            fontSize: '.88rem',
            color: '#6b6b6b',
            lineHeight: 1.75,
            fontFamily: 'Inter, sans-serif',
            margin: 0,
          }}>
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section style={{ background: '#f5f4f2', padding: '120px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <Reveal>
          <p style={{
            fontSize: '.72rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#6b6b6b',
            marginBottom: 14,
            fontFamily: 'Inter, sans-serif',
          }}>
            Preguntas frecuentes
          </p>
          <h2 style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(2.2rem,4.5vw,4.5rem)',
            fontWeight: 400,
            color: '#0a0a0a',
            lineHeight: 1.08,
            marginBottom: 56,
          }}>
            Todo lo que{' '}
            <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>necesitas saber</em>
          </h2>
        </Reveal>

        <div style={{ maxWidth: 820 }}>
          {FAQS.map((faq, idx) => (
            <Reveal key={faq.q} delay={idx * 0.06}>
              <FAQItem faq={faq} isLast={idx === FAQS.length - 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
