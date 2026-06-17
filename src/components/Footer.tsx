import { Link } from 'react-router-dom'
import { GREMIOS } from '../data/gremios'

const MUNICIPIOS_FOOTER = ['Bilbao', 'Getxo', 'Barakaldo', 'Leioa', 'Basauri']

export default function Footer() {
  const pilotGremios = GREMIOS.filter((g) => g.piloto)
  const allGremios = GREMIOS.slice(0, 8)

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p
              className="text-2xl tracking-tight m-0 mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Ofizio<sup style={{ fontSize: '0.55em' }}>®</sup>
            </p>
            <p className="text-sm text-gray-400 leading-relaxed m-0 mb-6">
              La plataforma de reformas y mantenimiento del hogar del Gran Bilbao.
              Profesionales verificados, presupuesto gratuito.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-white transition-colors no-underline border border-gray-700 rounded-full px-3 py-1.5"
              >
                WhatsApp
              </a>
              <a
                href="mailto:hola@ofizio.es"
                className="text-xs text-gray-400 hover:text-white transition-colors no-underline border border-gray-700 rounded-full px-3 py-1.5"
              >
                Email
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-4 m-0">Servicios</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {allGremios.map((g) => (
                <li key={g.id}>
                  <Link
                    to={`/servicios/${g.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors no-underline"
                  >
                    {g.nombreCorto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Municipios */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-4 m-0">Municipios</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {MUNICIPIOS_FOOTER.map((m) => (
                <li key={m}>
                  {pilotGremios.map((g) => (
                    <Link
                      key={g.id}
                      to={`/servicios/${g.slug}/${m.toLowerCase()}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors no-underline block"
                    >
                      {g.nombreCorto} en {m}
                    </Link>
                  ))}
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-4 m-0">Empresa</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {[
                { label: 'Cómo funciona', href: '/#como-funciona' },
                { label: 'Para profesionales', href: '/profesionales' },
                { label: 'Blog de reformas', href: '/blog' },
                { label: 'Contacto', href: 'mailto:hola@ofizio.es' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors no-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 m-0">
            © {new Date().getFullYear()} Ofizio · Gran Bilbao. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {['Aviso legal', 'Privacidad', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors no-underline">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
