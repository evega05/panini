import { Link } from 'react-router-dom'
import { useWizard } from '../context/WizardContext'

export default function NotFound() {
  const { openWizard } = useWizard()

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <p
        className="text-8xl font-normal m-0 mb-4 text-gray-200"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        404
      </p>
      <h1
        className="text-2xl sm:text-3xl font-normal m-0 mb-4"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Página no encontrada
      </h1>
      <p className="text-sm text-gray-500 mb-10 max-w-sm m-0">
        La página que buscas no existe o ha sido movida. Vuelve al inicio o pide tu presupuesto directamente.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="no-underline rounded-full px-8 py-3.5 text-sm bg-black text-white hover:bg-gray-900 transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ← Volver al inicio
        </Link>
        <button
          onClick={() => openWizard()}
          className="rounded-full px-8 py-3.5 text-sm border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors bg-white cursor-pointer border-solid"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Pedir presupuesto gratis
        </button>
      </div>
    </div>
  )
}
