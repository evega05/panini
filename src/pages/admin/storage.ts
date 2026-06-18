const KEYS = ['clientes','visitas','cobros','tareas','empleados','pagos','jornadas','obras','obraitems','asignaciones','leads','presupuestos','presupuestolineas']

export function loadAll(): Record<string,unknown[]> {
  const out: Record<string,unknown[]> = {}
  KEYS.forEach(k => { try { const r = localStorage.getItem('provenza_panel_'+k); out[k]=r?JSON.parse(r):[] } catch { out[k]=[] } })
  return out
}

export function persist(key: string, data: unknown[]) {
  try { localStorage.setItem('provenza_panel_'+key, JSON.stringify(data)) } catch(e) { console.error('storage',key,e) }
}
