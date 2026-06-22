export interface Gremio {
  id: string
  nombre: string
  nombreCorto: string
  descripcion: string
  icon: string
  slug: string
  piloto: boolean
  precios: { min: number; max: number; unidad: string }
  servicios: string[]
  faq?: { q: string; a: string }[]
}

export interface WizardData {
  gremioId: string
  descripcion: string
  urgente: boolean
  municipio: string
  nombre: string
  telefono: string
}
