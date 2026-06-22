export const MUNICIPIOS = [
  'Alonsotegi',
  'Barakaldo',
  'Basauri',
  'Berango',
  'Bilbao',
  'Derio',
  'Erandio',
  'Etxebarri',
  'Galdakao',
  'Getxo',
  'Leioa',
  'Loiu',
  'Muskiz',
  'Portugalete',
  'Santurtzi',
  'Sestao',
  'Sondika',
  'Sopela',
  'Trapagaran',
  'Zamudio',
] as const

export type Municipio = (typeof MUNICIPIOS)[number]
