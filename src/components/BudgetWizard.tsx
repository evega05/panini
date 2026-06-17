import { useEffect, useState } from 'react'
import { GREMIOS } from '../data/gremios'
import { MUNICIPIOS } from '../data/municipios'
import { useWizard } from '../context/WizardContext'
import type { WizardData } from '../types'

const WHATSAPP_NUMBER = '34624118284'

const STEPS = ['Servicio', 'Descripción', 'Contacto', 'Listo']

const EMPTY: WizardData = {
  gremioId: '',
  descripcion: '',
  urgente: false,
  municipio: '',
  nombre: '',
  telefono: '',
}

function buildWhatsAppMessage(data: WizardData): string {
  const gremio = GREMIOS.find((g) => g.id === data.gremioId)
  return encodeURIComponent(
    `🏠 *Nueva solicitud de presupuesto — Multiservicios Provenza*\n\n` +
    `📋 *Servicio:* ${gremio?.nombre ?? data.gremioId}\n` +
    `📝 *Descripción:* ${data.descripcion}\n` +
    `⚡ *Urgente:* ${data.urgente ? 'Sí, necesito atención rápida' : 'No'}\n` +
    `📍 *Municipio:* ${data.municipio}\n\n` +
    `👤 *Nombre:* ${data.nombre}\n` +
    `📱 *Teléfono:* ${data.telefono}`
  )
}

export default function BudgetWizard() {
  const { isOpen, preselectedGremioId, closeWizard } = useWizard()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStep(0)
      setSubmitted(false)
      setData({ ...EMPTY, gremioId: preselectedGremioId ?? '' })
    }
  }, [isOpen, preselectedGremioId])

  const update = <K extends keyof WizardData>(key: K, value: WizardData[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const canProceed = [
    data.gremioId !== '',
    data.descripcion.trim().length > 10 && data.municipio !== '',
    data.nombre.trim() !== '' && data.telefono.trim().length >= 9,
    true,
  ][step]

  const handleSubmit = () => {
    setSubmitted(true)
    const msg = buildWhatsAppMessage(data)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && closeWizard()}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 m-0 mb-1">
                Paso {step + 1} de {STEPS.length}
              </p>
              <p className="text-lg font-normal m-0" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {STEPS[step]}
              </p>
            </div>
            <button
              onClick={closeWizard}
              className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer text-gray-500 text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                  i <= step ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7 min-h-64">
          {step === 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-5 m-0">¿Qué tipo de trabajo necesitas?</p>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {GREMIOS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => update('gremioId', g.id)}
                    className={`text-left rounded-xl px-4 py-3.5 border transition-all cursor-pointer ${
                      data.gremioId === g.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-xl block mb-1">{g.icon}</span>
                    <span className="text-xs leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {g.nombreCorto}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
                  Describe el trabajo
                </label>
                <textarea
                  value={data.descripcion}
                  onChange={(e) => update('descripcion', e.target.value)}
                  placeholder="Ej: Tengo una fuga de agua bajo el lavabo del baño, lleva varios días goteando..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none outline-none focus:border-black transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
                  Municipio
                </label>
                <select
                  value={data.municipio}
                  onChange={(e) => update('municipio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="">Selecciona tu municipio</option>
                  {MUNICIPIOS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={data.urgente}
                  onChange={(e) => update('urgente', e.target.checked)}
                  className="w-4 h-4 rounded accent-black cursor-pointer"
                />
                <span className="text-sm text-gray-600">Es urgente (necesito atención lo antes posible)</span>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 m-0">
                Te contactaremos para enviarte presupuestos verificados de profesionales de tu zona.
              </p>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Nombre</label>
                <input
                  type="text"
                  value={data.nombre}
                  onChange={(e) => update('nombre', e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Teléfono</label>
                <input
                  type="tel"
                  value={data.telefono}
                  onChange={(e) => update('telefono', e.target.value)}
                  placeholder="+34 6XX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <p className="text-xs text-gray-400 m-0">
                Tus datos solo se usan para enviarte presupuestos. No compartimos tu información con terceros sin tu consentimiento.
              </p>
            </div>
          )}

          {step === 3 && !submitted && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 m-0 mb-2">Confirma tu solicitud antes de enviar:</p>
              {[
                { label: 'Servicio', value: GREMIOS.find((g) => g.id === data.gremioId)?.nombre },
                { label: 'Municipio', value: data.municipio },
                { label: 'Urgente', value: data.urgente ? 'Sí' : 'No' },
                { label: 'Nombre', value: data.nombre },
                { label: 'Teléfono', value: data.telefono },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start border-b border-gray-100 pb-2.5">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
                  <span className="text-sm text-right max-w-56">{value}</span>
                </div>
              ))}
            </div>
          )}

          {step === 3 && submitted && (
            <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
              <div className="text-4xl">✅</div>
              <p className="text-lg m-0" style={{ fontFamily: "'Instrument Serif', serif" }}>
                ¡Solicitud enviada!
              </p>
              <p className="text-sm text-gray-500 m-0 max-w-xs">
                En menos de 24 horas recibirás presupuestos de profesionales verificados de tu zona.
              </p>
              <button
                onClick={closeWizard}
                className="mt-2 rounded-full px-6 py-2.5 text-sm border border-gray-200 hover:border-black transition-colors bg-white cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!(step === 3 && submitted) && (
          <div className="px-8 pb-8 flex justify-between items-center">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-sm text-gray-400 hover:text-black transition-colors bg-transparent border-none cursor-pointer px-0 py-0"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ← Atrás
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed}
                className={`rounded-full px-6 py-3 text-sm border-none cursor-pointer transition-all ${
                  canProceed
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Continuar →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-full px-6 py-3 text-sm bg-green-600 text-white hover:bg-green-700 border-none cursor-pointer transition-colors flex items-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span>Enviar por WhatsApp</span>
                <span>✓</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
