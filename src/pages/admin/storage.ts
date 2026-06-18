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
  try {
    const { data, error } = await supabase.from('panel_data').select('key, data')
    if (error) throw error
    const out: Record<string,unknown[]> = {}
    KEYS.forEach(k => out[k]=[])
    ;(data||[]).forEach((row:{key:string;data:unknown[]}) => { out[row.key]=row.data||[] })
    // Si Supabase está vacío, migra los datos del localStorage automáticamente
    const hasData=(data||[]).length>0
    if (!hasData) {
      const local=fromLocal()
      const hasLocal=Object.values(local).some(a=>a.length>0)
      if (hasLocal) {
        await Promise.all(KEYS.map(k=>supabase.from('panel_data').upsert({key:k,data:local[k]})))
        return local
      }
    }
    return out
  } catch(e) {
    console.error('supabase loadAll',e)
    return fromLocal()
  }
}

export function persist(key: string, data: unknown[]) {
  try { localStorage.setItem('provenza_panel_'+key, JSON.stringify(data)) } catch(e) { console.error('storage',key,e) }
  supabase.from('panel_data').upsert({key,data}).then(({error})=>{ if(error) console.error('supabase persist',key,error) })
}
