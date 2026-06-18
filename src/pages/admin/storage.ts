import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jzdbicgtqozwtwwihhbb.supabase.co',
  'sb_publishable_yrDbUMS6IBvsyKvlsvDElw_RdLoozIQ'
)

const KEYS = ['clientes','visitas','cobros','tareas','empleados','pagos','jornadas','obras','obraitems','asignaciones','leads','presupuestos','presupuestolineas','facturas']

function fromLocal(): Record<string,unknown[]> {
  const out: Record<string,unknown[]> = {}
  KEYS.forEach(k => { try { const r = localStorage.getItem('provenza_panel_'+k); out[k]=r?JSON.parse(r):[] } catch { out[k]=[] } })
  return out
}

export async function loadAll(): Promise<Record<string,unknown[]>> {
  // Siempre carga primero desde localStorage (instantáneo y fiable)
  const local = fromLocal()
  // Luego intenta sincronizar con Supabase en segundo plano
  syncFromSupabase(local).catch(e => console.error('supabase sync', e))
  return local
}

async function syncFromSupabase(local: Record<string,unknown[]>) {
  const { data, error } = await supabase.from('panel_data').select('key, data')
  if (error) throw error
  const hasRemote = (data||[]).length > 0
  if (hasRemote) {
    // Supabase tiene datos: guárdalos en localStorage para la próxima carga
    ;(data||[]).forEach((row:{key:string;data:unknown[]}) => {
      try { localStorage.setItem('provenza_panel_'+row.key, JSON.stringify(row.data||[])) } catch {}
    })
  } else {
    // Supabase vacío: sube los datos locales
    const hasLocal = Object.values(local).some(a => a.length > 0)
    if (hasLocal) {
      await Promise.all(KEYS.map(k => supabase.from('panel_data').upsert({key:k, data:local[k]})))
    }
  }
}

export function persist(key: string, data: unknown[]) {
  try { localStorage.setItem('provenza_panel_'+key, JSON.stringify(data)) } catch(e) { console.error('storage',key,e) }
  supabase.from('panel_data').upsert({key,data}).then(({error})=>{ if(error) console.error('supabase persist',key,error) })
}
