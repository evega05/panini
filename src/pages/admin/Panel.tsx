import { useState, useEffect, useMemo } from 'react'
import {
  Plus, Hammer, Banknote, ListChecks, CalendarDays, Users, Wallet,
  Check, X, Clock, MapPin, Phone, Trash2, ChevronLeft, ChevronRight,
  AlertTriangle, Pencil, Sun, HardHat, UserPlus, Lock,
} from 'lucide-react'

/* ---------------- contraseña del panel ---------------- */
const PANEL_PASSWORD = 'provenza2024'
const SESSION_KEY = 'provenza_panel_auth'

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (pwd === PANEL_PASSWORD) { sessionStorage.setItem(SESSION_KEY, '1'); onAuth() }
    else { setError(true); setPwd(''); setTimeout(() => setError(false), 1800) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1B1F23', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Sans:wght@400;500&display=swap');`}</style>
      <div style={{ width: '100%', maxWidth: 340, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,162,39,0.15)', border: '1px solid #C9A227', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#C9A227' }}>
            <Lock size={20} />
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#C9A227', marginBottom: 6 }}>MULTISERVICIOS PROVENZA</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#F2EEE4' }}>Panel de gestión</div>
        </div>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Contraseña"
          autoFocus
          style={{
            width: '100%', padding: '12px 14px', background: '#242A33', border: `1px solid ${error ? '#E2625A' : '#3A4250'}`,
            borderRadius: 9, color: '#F2EEE4', fontSize: 15, fontFamily: 'inherit', marginBottom: 10,
            outline: 'none', transition: 'border-color 0.2s',
          }}
        />
        {error && <div style={{ color: '#E2625A', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>Contraseña incorrecta</div>}
        <button
          onClick={submit}
          style={{ width: '100%', padding: 13, background: '#C9A227', border: 'none', borderRadius: 9, color: '#1B1F23', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

/* ---------------- types ---------------- */
interface Cliente { id: string; nombre: string; telefono: string; direccion: string; frecuencia: string; notas: string }
interface Visita { id: string; clienteId: string; fecha: string; hora: string; tipo: string; direccion: string; notas: string; estado: string }
interface Cobro { id: string; clienteId: string; fecha: string; hora: string; importe: number; metodo: string; estado: string }
interface Tarea { id: string; descripcion: string; fecha: string; completada: boolean }
interface Empleado { id: string; nombre: string; tipoPago: 'hora' | 'dia' | 'fijo'; tarifa: number }
interface Pago { id: string; empleadoId: string; fecha: string; importe: number; concepto: string }
interface Jornada { id: string; empleadoId: string; fecha: string; pagado: boolean }
interface Obra { id: string; nombre: string; cliente: string; direccion: string; estado: string; fechaInicio: string; notas: string }
interface ObraItem { id: string; obraId: string; descripcion: string; gremio: string; completado: boolean }
interface Asignacion { id: string; obraId: string; empleadoId: string; fecha: string; notas: string }

interface DataBag { clientes: Cliente[]; visitas: Visita[]; cobros: Cobro[]; tareas: Tarea[] }

/* ---------------- date helpers ---------------- */
const pad = (n: number) => String(n).padStart(2, '0')
const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseISODate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const addDays = (s: string, n: number) => { const d = parseISODate(s); d.setDate(d.getDate() + n); return toISODate(d) }
const todayISO = () => toISODate(new Date())
const startOfWeek = (s: string) => { const d = parseISODate(s); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + diff); return toISODate(d) }
const weekDaysOf = (s: string) => { const start = startOfWeek(s); return Array.from({ length: 7 }, (_, i) => addDays(start, i)) }
const dayLabel = (s: string) => { const d = parseISODate(s); const t = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''); return t.charAt(0).toUpperCase() + t.slice(1) }
const dayNum = (s: string) => parseISODate(s).getDate()
const longLabel = (s: string) => { const d = parseISODate(s); const t = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }); return t.charAt(0).toUpperCase() + t.slice(1) }
const daysAgo = (s: string) => Math.round((parseISODate(todayISO()).getTime() - parseISODate(s).getTime()) / 86400000)
const monthKey = (s: string) => s.slice(0, 7)
const uid = () => crypto.randomUUID()

/* ---------------- localStorage storage ---------------- */
const KEYS = ['clientes', 'visitas', 'cobros', 'tareas', 'empleados', 'pagos', 'jornadas', 'obras', 'obraitems', 'asignaciones']

function loadAll() {
  const out: Record<string, unknown[]> = {}
  KEYS.forEach((k) => {
    try {
      const raw = localStorage.getItem(`provenza_panel_${k}`)
      out[k] = raw ? JSON.parse(raw) : []
    } catch { out[k] = [] }
  })
  return out
}

function persist(key: string, data: unknown[]) {
  try { localStorage.setItem(`provenza_panel_${key}`, JSON.stringify(data)) }
  catch (e) { console.error('storage error', key, e) }
}

/* ---------------- small UI atoms ---------------- */
function Stamp({ children, tone = 'brass', small }: { children: React.ReactNode; tone?: string; small?: boolean }) {
  return <div className={`aa-stamp aa-stamp--${tone} ${small ? 'aa-stamp--sm' : ''}`}>{children}</div>
}

function DeleteButton({ onConfirm, label = '' }: { onConfirm: () => void; label?: string }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 2500)
    return () => clearTimeout(t)
  }, [armed])
  if (armed) {
    return (
      <button className="aa-iconbtn aa-iconbtn--danger" onClick={() => { setArmed(false); onConfirm() }} title="Confirmar borrado">
        <Check size={15} />
      </button>
    )
  }
  return (
    <button className="aa-iconbtn" onClick={() => setArmed(true)} title={`Eliminar ${label}`}>
      <Trash2 size={15} />
    </button>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="aa-empty">{text}</div>
}

/* ---------------- DayAgenda ---------------- */
function DayAgenda({ date, data, onToggleEstado, onToggleTarea, onDelete }: {
  date: string
  data: DataBag
  onToggleEstado: (type: string, id: string) => void
  onToggleTarea: (id: string) => void
  onDelete: (collection: string, id: string) => void
}) {
  const { clientes, visitas, cobros, tareas } = data
  const clienteName = (id: string) => clientes.find((c) => c.id === id)?.nombre || 'Cliente'

  const sueltas = tareas.filter((t) => t.fecha === date)
  const vis = visitas.filter((v) => v.fecha === date).map((v) => ({ ...v, _type: 'visita' as const }))
  const cob = cobros.filter((c) => c.fecha === date).map((c) => ({ ...c, _type: 'cobro' as const }))
  const timed = [...vis, ...cob].sort((a, b) => (a.hora || '99:99').localeCompare(b.hora || '99:99'))

  if (timed.length === 0 && sueltas.length === 0) {
    return <EmptyState text="Nada agendado este día. Pulsa + para apuntar una visita, un cobro o una tarea." />
  }

  return (
    <div className="aa-daylist">
      {sueltas.length > 0 && (
        <div className="aa-task-row-group">
          {sueltas.map((t) => (
            <div key={t.id} className={`aa-taskrow ${t.completada ? 'is-done' : ''}`}>
              <button className="aa-checkbox" onClick={() => onToggleTarea(t.id)} aria-label="Marcar tarea">
                {t.completada ? <Check size={13} /> : null}
              </button>
              <span className="aa-taskrow__text">{t.descripcion}</span>
              <DeleteButton onConfirm={() => onDelete('tareas', t.id)} label="tarea" />
            </div>
          ))}
        </div>
      )}
      {timed.map((item) => {
        const isVisita = item._type === 'visita'
        const tone = isVisita ? 'water' : 'money'
        const done = isVisita ? item.estado === 'realizado' : item.estado === 'cobrado'
        return (
          <div key={item.id} className={`aa-ticket aa-ticket--${tone} ${done ? 'is-done' : ''}`}>
            <Stamp tone={tone}>{item.hora || '--:--'}</Stamp>
            <div className="aa-ticket__body">
              <div className="aa-ticket__top">
                <span className="aa-ticket__icon">{isVisita ? <Hammer size={14} /> : <Banknote size={14} />}</span>
                <span className="aa-ticket__client">{clienteName(item.clienteId)}</span>
              </div>
              {isVisita ? (
                <div className="aa-ticket__meta">
                  <span className="aa-tag">{(item as Visita).tipo}</span>
                  {(item as Visita).direccion && <span className="aa-ticket__sub"><MapPin size={11} /> {(item as Visita).direccion}</span>}
                  {(item as Visita).notas && <span className="aa-ticket__notas">{(item as Visita).notas}</span>}
                </div>
              ) : (
                <div className="aa-ticket__meta">
                  <span className="aa-tag aa-tag--money">{Number((item as Cobro).importe).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                  <span className="aa-ticket__sub">{(item as Cobro).metodo}</span>
                </div>
              )}
            </div>
            <div className="aa-ticket__actions">
              <button className="aa-iconbtn aa-iconbtn--ok" onClick={() => onToggleEstado(item._type, item.id)} title="Marcar hecho">
                <Check size={15} />
              </button>
              <DeleteButton onConfirm={() => onDelete(item._type === 'visita' ? 'visitas' : 'cobros', item.id)} label={isVisita ? 'visita' : 'cobro'} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- AddSheet ---------------- */
function AddSheet({ open, onClose, clientes, defaultDate, onCreate }: {
  open: boolean
  onClose: () => void
  clientes: Cliente[]
  defaultDate: string
  onCreate: (type: string, payload: Record<string, unknown>) => void
}) {
  const [step, setStep] = useState<null | 'visita' | 'cobro' | 'tarea'>(null)
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) { setStep(null); setForm({ fecha: defaultDate, hora: '09:00' }) }
  }, [open, defaultDate])

  if (!open) return null

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (step === 'tarea') {
      if (!form.descripcion?.trim()) return
      onCreate('tarea', { descripcion: form.descripcion.trim(), fecha: form.fecha || defaultDate })
    } else if (step === 'visita') {
      if (!form.cliente?.trim() || !form.fecha) return
      onCreate('visita', { clienteNombre: form.cliente.trim(), fecha: form.fecha, hora: form.hora || '', tipo: form.tipo || 'Presupuesto', direccion: form.direccion || '', notas: form.notas || '' })
    } else if (step === 'cobro') {
      if (!form.cliente?.trim() || !form.fecha || !form.importe) return
      onCreate('cobro', { clienteNombre: form.cliente.trim(), fecha: form.fecha, hora: form.hora || '', importe: Number(form.importe), metodo: form.metodo || 'Efectivo' })
    }
    onClose()
  }

  return (
    <div className="aa-overlay" onClick={onClose}>
      <div className="aa-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="aa-sheet__handle" />
        {!step && (
          <>
            <div className="aa-sheet__title">¿Qué quieres apuntar?</div>
            <div className="aa-choicegrid">
              <button className="aa-choice aa-choice--water" onClick={() => setStep('visita')}><Hammer size={22} /><span>Visita</span></button>
              <button className="aa-choice aa-choice--money" onClick={() => setStep('cobro')}><Banknote size={22} /><span>Cobro</span></button>
              <button className="aa-choice aa-choice--task" onClick={() => setStep('tarea')}><ListChecks size={22} /><span>Tarea</span></button>
            </div>
          </>
        )}
        {step === 'visita' && (
          <>
            <div className="aa-sheet__title">Nueva visita</div>
            <label className="aa-label">Cliente</label>
            <input className="aa-input" list="aa-clientes-list" value={form.cliente || ''} onChange={(e) => set('cliente', e.target.value)} placeholder="Nombre del cliente" />
            <datalist id="aa-clientes-list">{clientes.map((c) => <option key={c.id} value={c.nombre} />)}</datalist>
            <div className="aa-row2">
              <div><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} /></div>
              <div><label className="aa-label">Hora</label><input type="time" className="aa-input" value={form.hora} onChange={(e) => set('hora', e.target.value)} /></div>
            </div>
            <label className="aa-label">Tipo</label>
            <select className="aa-input" value={form.tipo || 'Presupuesto'} onChange={(e) => set('tipo', e.target.value)}>
              <option>Presupuesto</option><option>Reparación</option><option>Revisión</option><option>Mantenimiento</option>
            </select>
            <label className="aa-label">Dirección (opcional)</label>
            <input className="aa-input" value={form.direccion || ''} onChange={(e) => set('direccion', e.target.value)} placeholder="Calle, número" />
            <label className="aa-label">Notas (opcional)</label>
            <textarea className="aa-input aa-textarea" value={form.notas || ''} onChange={(e) => set('notas', e.target.value)} placeholder="Qué hay que hacer" />
            <button className="aa-submit aa-submit--water" onClick={submit}>Guardar visita</button>
          </>
        )}
        {step === 'cobro' && (
          <>
            <div className="aa-sheet__title">Nuevo cobro</div>
            <label className="aa-label">Cliente</label>
            <input className="aa-input" list="aa-clientes-list" value={form.cliente || ''} onChange={(e) => set('cliente', e.target.value)} placeholder="Nombre del cliente" />
            <datalist id="aa-clientes-list">{clientes.map((c) => <option key={c.id} value={c.nombre} />)}</datalist>
            <div className="aa-row2">
              <div><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} /></div>
              <div><label className="aa-label">Hora</label><input type="time" className="aa-input" value={form.hora} onChange={(e) => set('hora', e.target.value)} /></div>
            </div>
            <label className="aa-label">Importe (€)</label>
            <input type="number" inputMode="decimal" className="aa-input" value={form.importe || ''} onChange={(e) => set('importe', e.target.value)} placeholder="0.00" />
            <label className="aa-label">Método</label>
            <select className="aa-input" value={form.metodo || 'Efectivo'} onChange={(e) => set('metodo', e.target.value)}>
              <option>Efectivo</option><option>Transferencia</option><option>Bizum</option>
            </select>
            <button className="aa-submit aa-submit--money" onClick={submit}>Guardar cobro</button>
          </>
        )}
        {step === 'tarea' && (
          <>
            <div className="aa-sheet__title">Nueva tarea</div>
            <label className="aa-label">Descripción</label>
            <input className="aa-input" value={form.descripcion || ''} onChange={(e) => set('descripcion', e.target.value)} placeholder="Comprar material, llamar proveedor…" />
            <label className="aa-label">Fecha</label>
            <input type="date" className="aa-input" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
            <button className="aa-submit aa-submit--task" onClick={submit}>Guardar tarea</button>
          </>
        )}
        <button className="aa-sheet__close" onClick={onClose}><X size={16} /> Cerrar</button>
      </div>
    </div>
  )
}

/* ---------------- ClientesView ---------------- */
function ClientesView({ clientes, visitas, onAddCliente, onDeleteCliente, onUpdateCliente }: {
  clientes: Cliente[]; visitas: Visita[]
  onAddCliente: (d: Partial<Cliente>) => void
  onDeleteCliente: (id: string) => void
  onUpdateCliente: (id: string, d: Partial<Cliente>) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Cliente>>({})

  const openNew = () => { setForm({}); setEditing(null); setShowForm(true) }
  const openEdit = (c: Cliente) => { setForm(c); setEditing(c.id); setShowForm(true) }

  const submit = () => {
    if (!form.nombre?.trim()) return
    if (editing) onUpdateCliente(editing, form)
    else onAddCliente(form)
    setShowForm(false)
  }

  const stats = useMemo(() => clientes.map((c) => {
    const vs = visitas.filter((v) => v.clienteId === c.id).sort((a, b) => b.fecha.localeCompare(a.fecha))
    const last = vs[0]?.fecha
    const freqNum = Number(c.frecuencia)
    let overdue = false
    if (last && freqNum > 0) { const expected = Math.round(7 / freqNum); overdue = daysAgo(last) > expected * 1.6 }
    return { ...c, lastVisit: last, overdue }
  }), [clientes, visitas])

  return (
    <div className="aa-view">
      <div className="aa-viewheader"><span>Clientes</span><button className="aa-addsmall" onClick={openNew}><Plus size={14} /> Cliente</button></div>
      {stats.length === 0 && <EmptyState text="Sin clientes todavía. Añade uno o crea una visita y se guardará solo." />}
      <div className="aa-clientlist">
        {stats.map((c) => (
          <div key={c.id} className="aa-clientcard" onClick={() => openEdit(c)}>
            <div className="aa-clientcard__top">
              <span className="aa-clientcard__name">{c.nombre}</span>
              {c.overdue && <span className="aa-flag"><AlertTriangle size={12} /> atrasado</span>}
            </div>
            <div className="aa-clientcard__row">
              {c.telefono && <span><Phone size={11} /> {c.telefono}</span>}
              {c.frecuencia && <span className="aa-tag">{c.frecuencia}x/semana</span>}
            </div>
            {c.lastVisit ? <div className="aa-clientcard__sub">Última visita: hace {daysAgo(c.lastVisit)} días</div> : <div className="aa-clientcard__sub">Sin visitas todavía</div>}
          </div>
        ))}
      </div>
      {showForm && (
        <div className="aa-overlay" onClick={() => setShowForm(false)}>
          <div className="aa-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="aa-sheet__handle" />
            <div className="aa-sheet__title">{editing ? 'Editar cliente' : 'Nuevo cliente'}</div>
            <label className="aa-label">Nombre</label>
            <input className="aa-input" value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <label className="aa-label">Teléfono</label>
            <input className="aa-input" value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <label className="aa-label">Dirección</label>
            <input className="aa-input" value={form.direccion || ''} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            <label className="aa-label">Frecuencia estimada (veces por semana)</label>
            <input type="number" className="aa-input" value={form.frecuencia || ''} onChange={(e) => setForm({ ...form, frecuencia: e.target.value })} placeholder="ej. 1" />
            <label className="aa-label">Notas</label>
            <textarea className="aa-input aa-textarea" value={form.notas || ''} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            <button className="aa-submit aa-submit--brass" onClick={submit}>Guardar</button>
            {editing && <button className="aa-submit aa-submit--danger" onClick={() => { onDeleteCliente(editing); setShowForm(false) }}>Eliminar cliente</button>}
            <button className="aa-sheet__close" onClick={() => setShowForm(false)}><X size={16} /> Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- ObrasView ---------------- */
const ESTADOS_OBRA = ['En curso', 'Pausada', 'Terminada']
const GREMIOS_SUGERIDOS = ['Albañilería', 'Electricidad', 'Fontanería', 'Pintura', 'Carpintería', 'Climatización', 'Cerrajería', 'Solados', 'Pladur / Yesos']

function ObrasView({ obras, obraitems, asignaciones, empleados, onAddObra, onUpdateObra, onDeleteObra, onAddItem, onToggleItem, onDeleteItem, onAddAsignacion, onDeleteAsignacion }: {
  obras: Obra[]; obraitems: ObraItem[]; asignaciones: Asignacion[]; empleados: Empleado[]
  onAddObra: (d: Partial<Obra>) => void; onUpdateObra: (id: string, d: Partial<Obra>) => void; onDeleteObra: (id: string) => void
  onAddItem: (obraId: string, d: Partial<ObraItem>) => void; onToggleItem: (id: string) => void; onDeleteItem: (id: string) => void
  onAddAsignacion: (obraId: string, d: Partial<Asignacion>) => void; onDeleteAsignacion: (id: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Obra>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState<{ descripcion?: string; gremio?: string }>({})
  const [assignForm, setAssignForm] = useState<{ empleadoId?: string; fecha?: string; notas?: string }>({})

  const openNew = () => { setForm({ estado: 'En curso', fechaInicio: todayISO() }); setEditing(null); setShowForm(true) }
  const openEdit = (o: Obra) => { setForm(o); setEditing(o.id); setShowForm(true) }
  const submit = () => { if (!form.nombre?.trim()) return; editing ? onUpdateObra(editing, form) : onAddObra(form); setShowForm(false) }

  const submitItem = (obraId: string) => {
    if (!itemForm.descripcion?.trim()) return
    onAddItem(obraId, { descripcion: itemForm.descripcion.trim(), gremio: itemForm.gremio || '' })
    setItemForm({})
  }
  const submitAssign = (obraId: string) => {
    if (!assignForm.empleadoId) return
    onAddAsignacion(obraId, { empleadoId: assignForm.empleadoId, fecha: assignForm.fecha || '', notas: assignForm.notas || '' })
    setAssignForm({})
  }

  return (
    <div className="aa-view">
      <div className="aa-viewheader"><span>Obras</span><button className="aa-addsmall" onClick={openNew}><Plus size={14} /> Obra</button></div>
      {obras.length === 0 && <EmptyState text="Sin obras todavía. Añade una para llevar el control de lo que falta y quién va." />}
      <div className="aa-clientlist">
        {obras.map((o) => {
          const items = obraitems.filter((i) => i.obraId === o.id)
          const pendientesItems = items.filter((i) => !i.completado)
          const asigs = asignaciones.filter((a) => a.obraId === o.id)
          const open = openId === o.id
          return (
            <div key={o.id} className="aa-clientcard">
              <div className="aa-clientcard__top" onClick={() => setOpenId(open ? null : o.id)} style={{ cursor: 'pointer' }}>
                <span className="aa-clientcard__name">{o.nombre}</span>
                <span className={`aa-tag aa-tag--estado-${(o.estado || '').toLowerCase().replace(/\s/g, '')}`}>{o.estado || 'En curso'}</span>
              </div>
              <div className="aa-clientcard__row">
                {o.cliente && <span><Users size={11} /> {o.cliente}</span>}
                {o.direccion && <span><MapPin size={11} /> {o.direccion}</span>}
              </div>
              <div className="aa-clientcard__sub">
                {items.length === 0 ? 'Sin pendientes registrados' : `${pendientesItems.length} de ${items.length} pendiente${items.length === 1 ? '' : 's'}`}
                {asigs.length > 0 && ` · ${asigs.length} ${asigs.length === 1 ? 'persona asignada' : 'personas asignadas'}`}
              </div>
              {open && (
                <div className="aa-empexpand">
                  <button className="aa-addsmall" onClick={() => openEdit(o)}><Pencil size={13} /> Editar obra</button>
                  <div className="aa-obrablock">
                    <div className="aa-obrablock__title">Qué falta</div>
                    {items.length === 0 && <div className="aa-empty aa-empty--tight">Nada apuntado todavía.</div>}
                    <div className="aa-task-row-group">
                      {items.map((it) => (
                        <div key={it.id} className={`aa-taskrow ${it.completado ? 'is-done' : ''}`}>
                          <button className="aa-checkbox" onClick={() => onToggleItem(it.id)} aria-label="Marcar pendiente">{it.completado ? <Check size={13} /> : null}</button>
                          <span className="aa-taskrow__text">{it.gremio && <span className="aa-tag aa-tag--gremio">{it.gremio}</span>} {it.descripcion}</span>
                          <DeleteButton onConfirm={() => onDeleteItem(it.id)} label="pendiente" />
                        </div>
                      ))}
                    </div>
                    <div className="aa-inlineform">
                      <input className="aa-input" value={itemForm.descripcion || ''} onChange={(e) => setItemForm({ ...itemForm, descripcion: e.target.value })} placeholder="Qué falta por hacer" />
                      <input className="aa-input" list="aa-gremios-list" value={itemForm.gremio || ''} onChange={(e) => setItemForm({ ...itemForm, gremio: e.target.value })} placeholder="Gremio (opcional)" />
                      <datalist id="aa-gremios-list">{GREMIOS_SUGERIDOS.map((g) => <option key={g} value={g} />)}</datalist>
                      <button className="aa-addsmall" onClick={() => submitItem(o.id)}><Plus size={13} /> Añadir pendiente</button>
                    </div>
                  </div>
                  <div className="aa-obrablock">
                    <div className="aa-obrablock__title">Quién va a esta obra</div>
                    {asigs.length === 0 && <div className="aa-empty aa-empty--tight">Nadie asignado todavía.</div>}
                    <div className="aa-paylist">
                      {asigs.map((a) => {
                        const emp = empleados.find((e) => e.id === a.empleadoId)
                        return (
                          <div key={a.id} className="aa-payrow">
                            <span className="aa-payrow__concepto">{emp?.nombre || 'Empleado'}{a.notas ? ` · ${a.notas}` : ''}</span>
                            <span className="aa-payrow__date">{a.fecha || 'sin fecha'}</span>
                            <DeleteButton onConfirm={() => onDeleteAsignacion(a.id)} label="asignación" />
                          </div>
                        )
                      })}
                    </div>
                    {empleados.length === 0 ? (
                      <div className="aa-empty aa-empty--tight">Añade empleados en la pestaña Equipo para poder asignarlos.</div>
                    ) : (
                      <div className="aa-inlineform">
                        <select className="aa-input" value={assignForm.empleadoId || ''} onChange={(e) => setAssignForm({ ...assignForm, empleadoId: e.target.value })}>
                          <option value="">Elegir empleado…</option>
                          {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                        </select>
                        <input type="date" className="aa-input" value={assignForm.fecha || ''} onChange={(e) => setAssignForm({ ...assignForm, fecha: e.target.value })} />
                        <input className="aa-input" value={assignForm.notas || ''} onChange={(e) => setAssignForm({ ...assignForm, notas: e.target.value })} placeholder="Para qué (opcional)" />
                        <button className="aa-addsmall" onClick={() => submitAssign(o.id)}><UserPlus size={13} /> Asignar</button>
                      </div>
                    )}
                  </div>
                  <DeleteButton onConfirm={() => onDeleteObra(o.id)} label="obra" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {showForm && (
        <div className="aa-overlay" onClick={() => setShowForm(false)}>
          <div className="aa-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="aa-sheet__handle" />
            <div className="aa-sheet__title">{editing ? 'Editar obra' : 'Nueva obra'}</div>
            <label className="aa-label">Nombre de la obra</label>
            <input className="aa-input" value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Reforma piso C/ Mayor 12" />
            <label className="aa-label">Cliente</label>
            <input className="aa-input" value={form.cliente || ''} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
            <label className="aa-label">Dirección</label>
            <input className="aa-input" value={form.direccion || ''} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            <div className="aa-row2">
              <div>
                <label className="aa-label">Estado</label>
                <select className="aa-input" value={form.estado || 'En curso'} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  {ESTADOS_OBRA.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="aa-label">Fecha de inicio</label>
                <input type="date" className="aa-input" value={form.fechaInicio || ''} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} />
              </div>
            </div>
            <label className="aa-label">Notas</label>
            <textarea className="aa-input aa-textarea" value={form.notas || ''} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            <button className="aa-submit aa-submit--brass" onClick={submit}>Guardar</button>
            {editing && <button className="aa-submit aa-submit--danger" onClick={() => { onDeleteObra(editing); setShowForm(false) }}>Eliminar obra</button>}
            <button className="aa-sheet__close" onClick={() => setShowForm(false)}><X size={16} /> Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- EmpleadosView ---------------- */
function EmpleadosView({ empleados, pagos, jornadas, onAddEmpleado, onDeleteEmpleado, onAddPago, onCycleJornada, onMarkAllPaid }: {
  empleados: Empleado[]; pagos: Pago[]; jornadas: Jornada[]
  onAddEmpleado: (d: Partial<Empleado>) => void; onDeleteEmpleado: (id: string) => void
  onAddPago: (empId: string, d: Partial<Pago>) => void
  onCycleJornada: (empId: string, fecha: string) => void; onMarkAllPaid: (empId: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Empleado> & { tipoPago: string }>({ tipoPago: 'hora' })
  const [openId, setOpenId] = useState<string | null>(null)
  const [payForm, setPayForm] = useState<Partial<Pago>>({})
  const [showPay, setShowPay] = useState<string | null>(null)
  const [weekDate, setWeekDate] = useState(todayISO())
  const [rangoDesde, setRangoDesde] = useState(todayISO().slice(0, 8) + '01')
  const [rangoHasta, setRangoHasta] = useState(todayISO())

  const tipoLabel: Record<string, string> = { hora: '€ / hora', dia: '€ / día', fijo: '€ / mes' }
  const thisMonth = monthKey(todayISO())
  const week = useMemo(() => weekDaysOf(weekDate), [weekDate])

  const debeDe = (emp: Empleado) => {
    const pend = jornadas.filter((j) => j.empleadoId === emp.id && !j.pagado).length
    const estimado = emp.tipoPago === 'dia' ? pend * (Number(emp.tarifa) || 0) : null
    return { pend, estimado }
  }

  const globalStats = useMemo(() => {
    let dias = 0, estimado = 0
    empleados.forEach((emp) => { const { pend, estimado: est } = debeDe(emp); dias += pend; if (est !== null) estimado += est })
    return { dias, estimado }
  }, [empleados, jornadas])

  const totalPagadoRango = useMemo(() => pagos.filter((p) => p.fecha >= rangoDesde && p.fecha <= rangoHasta).reduce((s, p) => s + p.importe, 0), [pagos, rangoDesde, rangoHasta])

  const submitEmpleado = () => {
    if (!form.nombre?.trim()) return
    onAddEmpleado(form)
    setForm({ tipoPago: 'hora' })
    setShowForm(false)
  }

  const submitPago = (empId: string) => {
    if (!payForm.importe) return
    onAddPago(empId, { fecha: payForm.fecha || todayISO(), importe: Number(payForm.importe), concepto: payForm.concepto || '' })
    setPayForm({})
    setShowPay(null)
  }

  return (
    <div className="aa-view">
      <div className="aa-viewheader"><span>Equipo</span><button className="aa-addsmall" onClick={() => setShowForm(true)}><Plus size={14} /> Empleado</button></div>
      <div className="aa-globalcard">
        <div className="aa-globalcard__row">
          <span className="aa-globalcard__label">Debe el negocio en total</span>
          <span className="aa-globalcard__value aa-globalcard__value--brass">
            {globalStats.dias} {globalStats.dias === 1 ? 'día' : 'días'} sin pagar
            {globalStats.estimado > 0 ? ` · ~${globalStats.estimado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €` : ''}
          </span>
        </div>
        <div className="aa-globalcard__divider" />
        <div className="aa-globalcard__label" style={{ marginBottom: 6 }}>Total pagado entre fechas</div>
        <div className="aa-globalcard__rangerow">
          <input type="date" className="aa-input aa-input--sm" value={rangoDesde} onChange={(e) => setRangoDesde(e.target.value)} />
          <span className="aa-globalcard__y">a</span>
          <input type="date" className="aa-input aa-input--sm" value={rangoHasta} onChange={(e) => setRangoHasta(e.target.value)} />
        </div>
        <div className="aa-globalcard__row" style={{ marginTop: 6 }}>
          <span className="aa-globalcard__label">Pagado en ese periodo</span>
          <span className="aa-globalcard__value aa-globalcard__value--money">{totalPagadoRango.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
        </div>
      </div>
      {empleados.length === 0 && <EmptyState text="Sin empleados todavía. Añade uno para llevar el control de pagos." />}
      <div className="aa-clientlist">
        {empleados.map((e) => {
          const misPagos = pagos.filter((p) => p.empleadoId === e.id).sort((a, b) => b.fecha.localeCompare(a.fecha))
          const totalMes = misPagos.filter((p) => monthKey(p.fecha) === thisMonth).reduce((s, p) => s + p.importe, 0)
          const { pend: pendientes, estimado: debeEstimado } = debeDe(e)
          const open = openId === e.id
          return (
            <div key={e.id} className="aa-clientcard">
              <div className="aa-clientcard__top" onClick={() => setOpenId(open ? null : e.id)} style={{ cursor: 'pointer' }}>
                <span className="aa-clientcard__name">{e.nombre}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {pendientes > 0 && <span className="aa-flag"><AlertTriangle size={12} /> {pendientes} sin pagar</span>}
                  <span className="aa-tag">{e.tarifa} {tipoLabel[e.tipoPago]}</span>
                </div>
              </div>
              <div className="aa-clientcard__sub">Pagado este mes: <strong>{totalMes.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</strong></div>
              <div className="aa-clientcard__sub">Se le debe: <strong>{pendientes === 0 ? 'nada, al día' : `${pendientes} ${pendientes === 1 ? 'día' : 'días'}${debeEstimado !== null ? ` · ~${debeEstimado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €` : ''}`}</strong></div>
              {open && (
                <div className="aa-empexpand">
                  <div className="aa-jornadas">
                    <div className="aa-jornadas__nav">
                      <button className="aa-iconbtn" onClick={() => setWeekDate(addDays(weekDate, -7))}><ChevronLeft size={14} /></button>
                      <span className="aa-jornadas__label">Semana del {dayNum(week[0])} al {dayNum(week[6])}</span>
                      <button className="aa-iconbtn" onClick={() => setWeekDate(addDays(weekDate, 7))}><ChevronRight size={14} /></button>
                    </div>
                    <div className="aa-jornadas__days">
                      {week.map((d) => {
                        const rec = jornadas.find((j) => j.empleadoId === e.id && j.fecha === d)
                        const state = !rec ? 'empty' : rec.pagado ? 'paid' : 'pending'
                        const isToday = d === todayISO()
                        return (
                          <button key={d} className={`aa-jdaybtn is-${state} ${isToday ? 'is-today' : ''}`} onClick={() => onCycleJornada(e.id, d)}>
                            <span className="aa-jdaybtn__wd">{dayLabel(d)}</span>
                            <span className="aa-jdaybtn__num">{dayNum(d)}</span>
                            {state === 'paid' && <Check size={11} />}
                            {state === 'pending' && <Clock size={11} />}
                          </button>
                        )
                      })}
                    </div>
                    <div className="aa-jornadas__legend">
                      <span><i className="aa-dot aa-dot--task" /> sin marcar</span>
                      <span><i className="aa-dot aa-dot--brass" /> asistió, sin pagar</span>
                      <span><i className="aa-dot aa-dot--money" /> pagado</span>
                    </div>
                    <div className="aa-jornadas__count">Toca un día para pasar de asistió → pagado → vacío</div>
                  </div>
                  {pendientes > 0 && (
                    <div className="aa-pendingbar">
                      <span><AlertTriangle size={13} /> Liquidar {pendientes} {pendientes === 1 ? 'día' : 'días'} pendientes</span>
                      <button className="aa-addsmall aa-addsmall--brass" onClick={() => onMarkAllPaid(e.id)}>Marcar todo pagado</button>
                    </div>
                  )}
                  <button className="aa-addsmall" onClick={() => setShowPay(e.id)}><Plus size={13} /> Registrar pago</button>
                  {misPagos.length === 0 ? (
                    <div className="aa-empty aa-empty--tight">Sin pagos registrados.</div>
                  ) : (
                    <div className="aa-paylist">
                      {misPagos.slice(0, 8).map((p) => (
                        <div key={p.id} className="aa-payrow">
                          <span className="aa-payrow__date">{p.fecha}</span>
                          <span className="aa-payrow__concepto">{p.concepto || 'Pago'}</span>
                          <span className="aa-payrow__importe">{p.importe.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <DeleteButton onConfirm={() => onDeleteEmpleado(e.id)} label="empleado" />
                </div>
              )}
              {showPay === e.id && (
                <div className="aa-overlay" onClick={() => setShowPay(null)}>
                  <div className="aa-sheet" onClick={(ev) => ev.stopPropagation()}>
                    <div className="aa-sheet__handle" />
                    <div className="aa-sheet__title">Pago a {e.nombre}</div>
                    <label className="aa-label">Fecha</label>
                    <input type="date" className="aa-input" value={payForm.fecha || todayISO()} onChange={(ev) => setPayForm({ ...payForm, fecha: ev.target.value })} />
                    <label className="aa-label">Importe (€)</label>
                    <input type="number" className="aa-input" value={payForm.importe || ''} onChange={(ev) => setPayForm({ ...payForm, importe: Number(ev.target.value) })} />
                    <label className="aa-label">Concepto</label>
                    <input className="aa-input" value={payForm.concepto || ''} onChange={(ev) => setPayForm({ ...payForm, concepto: ev.target.value })} placeholder="Semana del…" />
                    <button className="aa-submit aa-submit--brass" onClick={() => submitPago(e.id)}>Guardar pago</button>
                    <button className="aa-sheet__close" onClick={() => setShowPay(null)}><X size={16} /> Cerrar</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {showForm && (
        <div className="aa-overlay" onClick={() => setShowForm(false)}>
          <div className="aa-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="aa-sheet__handle" />
            <div className="aa-sheet__title">Nuevo empleado</div>
            <label className="aa-label">Nombre</label>
            <input className="aa-input" value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <label className="aa-label">Tipo de pago</label>
            <select className="aa-input" value={form.tipoPago} onChange={(e) => setForm({ ...form, tipoPago: e.target.value as 'hora' | 'dia' | 'fijo' })}>
              <option value="hora">Por hora</option><option value="dia">Por día</option><option value="fijo">Fijo mensual</option>
            </select>
            <label className="aa-label">Tarifa (€)</label>
            <input type="number" className="aa-input" value={form.tarifa || ''} onChange={(e) => setForm({ ...form, tarifa: Number(e.target.value) })} />
            <button className="aa-submit aa-submit--brass" onClick={submitEmpleado}>Guardar empleado</button>
            <button className="aa-sheet__close" onClick={() => setShowForm(false)}><X size={16} /> Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- Panel (main export) ---------------- */
export default function Panel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [loaded, setLoaded] = useState(false)
  const [view, setView] = useState<'hoy' | 'semana' | 'obras' | 'clientes' | 'equipo'>('hoy')
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [addOpen, setAddOpen] = useState(false)

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [cobros, setCobros] = useState<Cobro[]>([])
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [jornadas, setJornadas] = useState<Jornada[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [obraitems, setObraitems] = useState<ObraItem[]>([])
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([])

  useEffect(() => {
    const d = loadAll()
    setClientes(d.clientes as Cliente[]); setVisitas(d.visitas as Visita[]); setCobros(d.cobros as Cobro[])
    setTareas(d.tareas as Tarea[]); setEmpleados(d.empleados as Empleado[]); setPagos(d.pagos as Pago[])
    setJornadas(d.jornadas as Jornada[]); setObras(d.obras as Obra[])
    setObraitems(d.obraitems as ObraItem[]); setAsignaciones(d.asignaciones as Asignacion[])
    setLoaded(true)
  }, [])

  const findOrCreateCliente = (nombre: string, list: Cliente[]) => {
    const match = list.find((c) => c.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())
    if (match) return { id: match.id, list }
    const nuevo: Cliente = { id: uid(), nombre: nombre.trim(), telefono: '', direccion: '', frecuencia: '', notas: '' }
    return { id: nuevo.id, list: [...list, nuevo] }
  }

  const handleCreate = (type: string, payload: Record<string, unknown>) => {
    if (type === 'tarea') {
      const next = [...tareas, { id: uid(), descripcion: payload.descripcion as string, fecha: payload.fecha as string, completada: false }]
      setTareas(next); persist('tareas', next); return
    }
    const { id: clienteId, list: nuevosClientes } = findOrCreateCliente(payload.clienteNombre as string, clientes)
    if (nuevosClientes !== clientes) { setClientes(nuevosClientes); persist('clientes', nuevosClientes) }
    if (type === 'visita') {
      const next = [...visitas, { id: uid(), clienteId, fecha: payload.fecha as string, hora: payload.hora as string, tipo: payload.tipo as string, direccion: payload.direccion as string, notas: payload.notas as string, estado: 'pendiente' }]
      setVisitas(next); persist('visitas', next)
    } else if (type === 'cobro') {
      const next = [...cobros, { id: uid(), clienteId, fecha: payload.fecha as string, hora: payload.hora as string, importe: payload.importe as number, metodo: payload.metodo as string, estado: 'pendiente' }]
      setCobros(next); persist('cobros', next)
    }
  }

  const toggleEstado = (type: string, id: string) => {
    if (type === 'visita') {
      const next = visitas.map((v) => v.id === id ? { ...v, estado: v.estado === 'realizado' ? 'pendiente' : 'realizado' } : v)
      setVisitas(next); persist('visitas', next)
    } else {
      const next = cobros.map((c) => c.id === id ? { ...c, estado: c.estado === 'cobrado' ? 'pendiente' : 'cobrado' } : c)
      setCobros(next); persist('cobros', next)
    }
  }

  const toggleTarea = (id: string) => {
    const next = tareas.map((t) => t.id === id ? { ...t, completada: !t.completada } : t)
    setTareas(next); persist('tareas', next)
  }

  const deleteItem = (collection: string, id: string) => {
    const map: Record<string, [unknown[], (v: unknown[]) => void]> = {
      visitas: [visitas, setVisitas as (v: unknown[]) => void],
      cobros: [cobros, setCobros as (v: unknown[]) => void],
      tareas: [tareas, setTareas as (v: unknown[]) => void],
      clientes: [clientes, setClientes as (v: unknown[]) => void],
      empleados: [empleados, setEmpleados as (v: unknown[]) => void],
      obraitems: [obraitems, setObraitems as (v: unknown[]) => void],
      asignaciones: [asignaciones, setAsignaciones as (v: unknown[]) => void],
    }
    const [arr, setter] = map[collection]
    const next = (arr as { id: string }[]).filter((x) => x.id !== id)
    setter(next); persist(collection, next)
  }

  const addObra = (data: Partial<Obra>) => { const next = [...obras, { id: uid(), cliente: '', direccion: '', notas: '', estado: 'En curso', fechaInicio: todayISO(), nombre: '', ...data }]; setObras(next); persist('obras', next) }
  const updateObra = (id: string, data: Partial<Obra>) => { const next = obras.map((o) => o.id === id ? { ...o, ...data } : o); setObras(next); persist('obras', next) }
  const deleteObra = (id: string) => {
    const nextObras = obras.filter((o) => o.id !== id); setObras(nextObras); persist('obras', nextObras)
    const nextItems = obraitems.filter((i) => i.obraId !== id); setObraitems(nextItems); persist('obraitems', nextItems)
    const nextAsigs = asignaciones.filter((a) => a.obraId !== id); setAsignaciones(nextAsigs); persist('asignaciones', nextAsigs)
  }
  const addObraItem = (obraId: string, data: Partial<ObraItem>) => { const next = [...obraitems, { id: uid(), obraId, completado: false, descripcion: '', gremio: '', ...data }]; setObraitems(next); persist('obraitems', next) }
  const toggleObraItem = (id: string) => { const next = obraitems.map((i) => i.id === id ? { ...i, completado: !i.completado } : i); setObraitems(next); persist('obraitems', next) }
  const addAsignacion = (obraId: string, data: Partial<Asignacion>) => { const next = [...asignaciones, { id: uid(), obraId, empleadoId: '', fecha: '', notas: '', ...data }]; setAsignaciones(next); persist('asignaciones', next) }

  const addCliente = (data: Partial<Cliente>) => { const next = [...clientes, { id: uid(), telefono: '', direccion: '', frecuencia: '', notas: '', nombre: '', ...data }]; setClientes(next); persist('clientes', next) }
  const updateCliente = (id: string, data: Partial<Cliente>) => { const next = clientes.map((c) => c.id === id ? { ...c, ...data } : c); setClientes(next); persist('clientes', next) }
  const addEmpleado = (data: Partial<Empleado>) => { const base = { id: uid(), nombre: '', tipoPago: 'hora' as const, tarifa: 0, ...data }; base.tarifa = Number(data.tarifa ?? 0); const next = [...empleados, base]; setEmpleados(next); persist('empleados', next) }
  const cycleJornada = (empleadoId: string, fecha: string) => {
    const existing = jornadas.find((j) => j.empleadoId === empleadoId && j.fecha === fecha)
    let next: Jornada[]
    if (!existing) next = [...jornadas, { id: uid(), empleadoId, fecha, pagado: false }]
    else if (!existing.pagado) next = jornadas.map((j) => j.id === existing.id ? { ...j, pagado: true } : j)
    else next = jornadas.filter((j) => j.id !== existing.id)
    setJornadas(next); persist('jornadas', next)
  }
  const markAllPaid = (empleadoId: string) => { const next = jornadas.map((j) => j.empleadoId === empleadoId && !j.pagado ? { ...j, pagado: true } : j); setJornadas(next); persist('jornadas', next) }
  const addPago = (empleadoId: string, data: Partial<Pago>) => { const next = [...pagos, { id: uid(), empleadoId, fecha: todayISO(), importe: 0, concepto: '', ...data }]; setPagos(next); persist('pagos', next) }

  const dataBag: DataBag = { clientes, visitas, cobros, tareas }
  const week = useMemo(() => weekDaysOf(selectedDate), [selectedDate])

  if (!loaded) {
    return (
      <div className="aa-root aa-root--loading">
        <style>{CSS}</style>
        <Sun className="aa-spin" size={26} />
      </div>
    )
  }

  return (
    <div className="aa-root">
      <style>{CSS}</style>
      <header className="aa-header">
        <div className="aa-eyebrow">LIBRO DE OBRA · PROVENZA</div>
        {view === 'hoy' && (
          <div className="aa-datenav">
            <button className="aa-iconbtn" onClick={() => setSelectedDate(addDays(selectedDate, -1))}><ChevronLeft size={18} /></button>
            <div className="aa-datenav__label">{longLabel(selectedDate)}</div>
            <button className="aa-iconbtn" onClick={() => setSelectedDate(addDays(selectedDate, 1))}><ChevronRight size={18} /></button>
          </div>
        )}
        {view === 'hoy' && selectedDate !== todayISO() && (
          <button className="aa-todaybtn" onClick={() => setSelectedDate(todayISO())}>Ir a hoy</button>
        )}
        {view === 'semana' && <div className="aa-datenav__label aa-datenav__label--solo">Semana</div>}
        {view === 'obras' && <div className="aa-datenav__label aa-datenav__label--solo">Obras</div>}
        {view === 'clientes' && <div className="aa-datenav__label aa-datenav__label--solo">Clientes</div>}
        {view === 'equipo' && <div className="aa-datenav__label aa-datenav__label--solo">Equipo</div>}
      </header>

      <main className="aa-main">
        {view === 'hoy' && <DayAgenda date={selectedDate} data={dataBag} onToggleEstado={toggleEstado} onToggleTarea={toggleTarea} onDelete={deleteItem} />}
        {view === 'semana' && (
          <>
            <div className="aa-weekstrip">
              {week.map((d) => {
                const vCount = visitas.filter((v) => v.fecha === d).length
                const cCount = cobros.filter((c) => c.fecha === d).length
                const tCount = tareas.filter((t) => t.fecha === d).length
                const isSel = d === selectedDate
                const isToday = d === todayISO()
                return (
                  <button key={d} className={`aa-daypill ${isSel ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`} onClick={() => setSelectedDate(d)}>
                    <span className="aa-daypill__wd">{dayLabel(d)}</span>
                    <span className="aa-daypill__num">{dayNum(d)}</span>
                    <span className="aa-daypill__dots">
                      {vCount > 0 && <i className="aa-dot aa-dot--water" />}
                      {cCount > 0 && <i className="aa-dot aa-dot--money" />}
                      {tCount > 0 && <i className="aa-dot aa-dot--task" />}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="aa-weekday-title">{longLabel(selectedDate)}</div>
            <DayAgenda date={selectedDate} data={dataBag} onToggleEstado={toggleEstado} onToggleTarea={toggleTarea} onDelete={deleteItem} />
          </>
        )}
        {view === 'obras' && (
          <ObrasView obras={obras} obraitems={obraitems} asignaciones={asignaciones} empleados={empleados}
            onAddObra={addObra} onUpdateObra={updateObra} onDeleteObra={deleteObra}
            onAddItem={addObraItem} onToggleItem={toggleObraItem} onDeleteItem={(id) => deleteItem('obraitems', id)}
            onAddAsignacion={addAsignacion} onDeleteAsignacion={(id) => deleteItem('asignaciones', id)} />
        )}
        {view === 'clientes' && (
          <ClientesView clientes={clientes} visitas={visitas} onAddCliente={addCliente} onDeleteCliente={(id) => deleteItem('clientes', id)} onUpdateCliente={updateCliente} />
        )}
        {view === 'equipo' && (
          <EmpleadosView empleados={empleados} pagos={pagos} jornadas={jornadas} onAddEmpleado={addEmpleado} onDeleteEmpleado={(id) => deleteItem('empleados', id)} onAddPago={addPago} onCycleJornada={cycleJornada} onMarkAllPaid={markAllPaid} />
        )}
      </main>

      <button className="aa-fab" onClick={() => setAddOpen(true)} aria-label="Añadir"><Plus size={24} /></button>

      <nav className="aa-tabbar">
        <button className={`aa-tab ${view === 'hoy' ? 'is-active' : ''}`} onClick={() => setView('hoy')}><Clock size={18} /><span>Hoy</span></button>
        <button className={`aa-tab ${view === 'semana' ? 'is-active' : ''}`} onClick={() => setView('semana')}><CalendarDays size={18} /><span>Semana</span></button>
        <button className={`aa-tab ${view === 'obras' ? 'is-active' : ''}`} onClick={() => setView('obras')}><HardHat size={18} /><span>Obras</span></button>
        <button className={`aa-tab ${view === 'clientes' ? 'is-active' : ''}`} onClick={() => setView('clientes')}><Users size={18} /><span>Clientes</span></button>
        <button className={`aa-tab ${view === 'equipo' ? 'is-active' : ''}`} onClick={() => setView('equipo')}><Wallet size={18} /><span>Equipo</span></button>
      </nav>

      <AddSheet open={addOpen} onClose={() => setAddOpen(false)} clientes={clientes} defaultDate={selectedDate} onCreate={handleCreate} />
    </div>
  )
}

/* ---------------- styles ---------------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

.aa-root {
  --bg: #1B1F23; --surface: #242A33; --surface-2: #2D343F; --border: #3A4250;
  --text: #F2EEE4; --text-dim: #9AA3AF;
  --brass: #C9A227; --brass-dim: rgba(201,162,39,0.16);
  --water: #3FA9D6; --water-dim: rgba(63,169,214,0.16);
  --money: #5FBE7E; --money-dim: rgba(95,190,126,0.16);
  --task: #AAB3BF; --task-dim: rgba(170,179,191,0.14);
  --danger: #E2625A; --danger-dim: rgba(226,98,90,0.16);
  --radius: 9px;
  position: fixed; inset: 0;
  background: var(--bg); color: var(--text);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  display: flex; flex-direction: column; overflow: hidden;
  z-index: 9999;
}
.aa-root--loading { align-items: center; justify-content: center; }
.aa-spin { color: var(--brass); animation: aa-spin 1.4s linear infinite; }
@keyframes aa-spin { to { transform: rotate(360deg); } }
* { box-sizing: border-box; }
.aa-header { padding: 18px 18px 12px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.aa-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: var(--brass); margin-bottom: 8px; }
.aa-datenav { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.aa-datenav__label { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 600; text-align: center; flex: 1; }
.aa-datenav__label--solo { text-align: left; font-size: 19px; }
.aa-todaybtn { margin-top: 8px; background: var(--brass-dim); color: var(--brass); border: 1px solid var(--brass); border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer; }
.aa-main { flex: 1; overflow-y: auto; padding: 14px 14px 90px; }
.aa-empty { color: var(--text-dim); font-size: 13.5px; text-align: center; padding: 40px 20px; line-height: 1.5; }
.aa-empty--tight { padding: 10px 4px; text-align: left; }
.aa-stamp { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 12.5px; border: 1.5px dashed var(--water); color: var(--water); border-radius: 6px; padding: 5px 6px; min-width: 50px; text-align: center; transform: rotate(-1.5deg); flex-shrink: 0; background: var(--water-dim); }
.aa-stamp--money { border-color: var(--money); color: var(--money); background: var(--money-dim); }
.aa-stamp--brass { border-color: var(--brass); color: var(--brass); background: var(--brass-dim); }
.aa-daylist { display: flex; flex-direction: column; gap: 10px; }
.aa-task-row-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 4px; }
.aa-taskrow { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--task); border-radius: var(--radius); padding: 9px 10px; }
.aa-taskrow.is-done { opacity: 0.5; }
.aa-taskrow.is-done .aa-taskrow__text { text-decoration: line-through; }
.aa-taskrow__text { flex: 1; font-size: 13.5px; }
.aa-checkbox { width: 20px; height: 20px; border-radius: 5px; border: 1.5px solid var(--task); background: transparent; color: var(--bg); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
.aa-taskrow.is-done .aa-checkbox { background: var(--task); color: var(--bg); }
.aa-ticket { display: flex; gap: 10px; align-items: flex-start; background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--water); border-radius: var(--radius); padding: 10px; }
.aa-ticket--money { border-left-color: var(--money); }
.aa-ticket.is-done { opacity: 0.55; }
.aa-ticket__body { flex: 1; min-width: 0; }
.aa-ticket__top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.aa-ticket__icon { color: var(--text-dim); display: flex; }
.aa-ticket__client { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; }
.aa-ticket__meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.aa-ticket__sub { font-size: 12px; color: var(--text-dim); display: flex; align-items: center; gap: 3px; }
.aa-ticket__notas { font-size: 12px; color: var(--text-dim); width: 100%; }
.aa-ticket__actions { display: flex; flex-direction: column; gap: 6px; }
.aa-tag { font-size: 11px; font-weight: 600; background: var(--water-dim); color: var(--water); border-radius: 5px; padding: 2px 7px; }
.aa-tag--money { background: var(--money-dim); color: var(--money); }
.aa-tag--gremio { background: var(--surface-2); color: var(--text-dim); margin-right: 4px; }
.aa-tag--estado-encurso { background: var(--water-dim); color: var(--water); }
.aa-tag--estado-pausada { background: var(--brass-dim); color: var(--brass); }
.aa-tag--estado-terminada { background: var(--money-dim); color: var(--money); }
.aa-iconbtn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text-dim); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.aa-iconbtn--ok { color: var(--money); }
.aa-iconbtn--danger { background: var(--danger-dim); color: var(--danger); border-color: var(--danger); }
.aa-weekstrip { display: flex; gap: 5px; margin-bottom: 14px; }
.aa-daypill { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 2px; cursor: pointer; color: var(--text-dim); }
.aa-daypill.is-today { border-color: var(--brass); }
.aa-daypill.is-selected { background: var(--brass-dim); border-color: var(--brass); color: var(--text); }
.aa-daypill__wd { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; }
.aa-daypill__num { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; }
.aa-daypill__dots { display: flex; gap: 2px; height: 5px; }
.aa-dot { width: 5px; height: 5px; border-radius: 50%; display: inline-block; }
.aa-dot--water { background: var(--water); } .aa-dot--money { background: var(--money); } .aa-dot--task { background: var(--task); } .aa-dot--brass { background: var(--brass); }
.aa-weekday-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; margin-bottom: 10px; color: var(--text-dim); }
.aa-view { display: flex; flex-direction: column; }
.aa-viewheader { display: flex; align-items: center; justify-content: space-between; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; margin-bottom: 12px; }
.aa-addsmall { display: flex; align-items: center; gap: 4px; background: var(--brass-dim); color: var(--brass); border: 1px solid var(--brass); border-radius: 7px; padding: 5px 9px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.aa-addsmall--brass { background: var(--brass); color: var(--bg); border-color: var(--brass); flex-shrink: 0; }
.aa-clientlist { display: flex; flex-direction: column; gap: 8px; }
.aa-clientcard { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 11px; cursor: pointer; }
.aa-clientcard__top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.aa-clientcard__name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; }
.aa-clientcard__row { display: flex; gap: 10px; align-items: center; margin-top: 5px; font-size: 12px; color: var(--text-dim); }
.aa-clientcard__row span { display: flex; align-items: center; gap: 3px; }
.aa-clientcard__sub { font-size: 12px; color: var(--text-dim); margin-top: 5px; }
.aa-obrablock { margin-top: 4px; }
.aa-obrablock__title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 12.5px; color: var(--text-dim); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
.aa-inlineform { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.aa-flag { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--danger); font-weight: 600; }
.aa-empexpand { margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border); display: flex; flex-direction: column; gap: 8px; }
.aa-jornadas { background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 9px; }
.aa-jornadas__nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.aa-jornadas__label { font-size: 11.5px; color: var(--text-dim); font-weight: 600; }
.aa-jornadas__days { display: flex; gap: 4px; }
.aa-jdaybtn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; background: var(--surface); border: 1px solid var(--border); border-radius: 7px; padding: 6px 2px; cursor: pointer; color: var(--text-dim); }
.aa-jdaybtn.is-today { border-color: var(--brass); }
.aa-jdaybtn.is-pending { background: var(--brass-dim); border-color: var(--brass); color: var(--brass); }
.aa-jdaybtn.is-paid { background: var(--money-dim); border-color: var(--money); color: var(--money); }
.aa-jdaybtn__wd { font-size: 9.5px; font-weight: 600; }
.aa-jdaybtn__num { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; }
.aa-jornadas__count { font-size: 11px; color: var(--text-dim); margin-top: 6px; text-align: center; }
.aa-jornadas__legend { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 8px; font-size: 10.5px; color: var(--text-dim); }
.aa-jornadas__legend span { display: flex; align-items: center; gap: 4px; }
.aa-pendingbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--brass-dim); border: 1px solid var(--brass); color: var(--brass); border-radius: 8px; padding: 8px 10px; font-size: 12px; font-weight: 600; }
.aa-globalcard { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin-bottom: 12px; }
.aa-globalcard__row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.aa-globalcard__label { font-size: 12px; color: var(--text-dim); font-weight: 600; }
.aa-globalcard__value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; text-align: right; }
.aa-globalcard__value--brass { color: var(--brass); } .aa-globalcard__value--money { color: var(--money); }
.aa-globalcard__divider { height: 1px; background: var(--border); margin: 10px 0; }
.aa-globalcard__rangerow { display: flex; align-items: center; gap: 8px; }
.aa-globalcard__y { font-size: 11.5px; color: var(--text-dim); }
.aa-input--sm { padding: 6px 7px; font-size: 12.5px; flex: 1; }
.aa-paylist { display: flex; flex-direction: column; gap: 4px; }
.aa-payrow { display: flex; gap: 8px; font-size: 12px; color: var(--text-dim); }
.aa-payrow__date { font-family: 'IBM Plex Mono', monospace; }
.aa-payrow__concepto { flex: 1; }
.aa-payrow__importe { color: var(--brass); font-weight: 600; }
.aa-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: flex-end; z-index: 30; }
.aa-sheet { width: 100%; max-height: 86%; overflow-y: auto; background: var(--surface); border-top: 1px solid var(--border); border-radius: 16px 16px 0 0; padding: 10px 18px 24px; display: flex; flex-direction: column; }
.aa-sheet__handle { width: 36px; height: 4px; border-radius: 3px; background: var(--border); margin: 4px auto 14px; }
.aa-sheet__title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; margin-bottom: 12px; }
.aa-choicegrid { display: flex; gap: 8px; }
.aa-choice { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 6px; border-radius: 11px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); cursor: pointer; font-size: 12.5px; font-weight: 600; }
.aa-choice--water { color: var(--water); border-color: var(--water); background: var(--water-dim); }
.aa-choice--money { color: var(--money); border-color: var(--money); background: var(--money-dim); }
.aa-choice--task { color: var(--task); border-color: var(--task); background: var(--task-dim); }
.aa-label { font-size: 11.5px; color: var(--text-dim); margin: 10px 0 4px; display: block; font-weight: 600; }
.aa-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 7px; padding: 9px 10px; color: var(--text); font-size: 14px; font-family: 'IBM Plex Sans', sans-serif; }
.aa-textarea { resize: vertical; min-height: 56px; }
.aa-row2 { display: flex; gap: 10px; }
.aa-row2 > div { flex: 1; }
.aa-submit { margin-top: 16px; padding: 12px; border-radius: 9px; border: none; font-weight: 700; font-size: 14.5px; cursor: pointer; color: var(--bg); background: var(--brass); width: 100%; }
.aa-submit--water { background: var(--water); } .aa-submit--money { background: var(--money); } .aa-submit--task { background: var(--task); } .aa-submit--brass { background: var(--brass); }
.aa-submit--danger { background: transparent; color: var(--danger); border: 1px solid var(--danger); margin-top: 8px; }
.aa-sheet__close { margin-top: 14px; background: none; border: none; color: var(--text-dim); display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 13px; cursor: pointer; padding: 6px; width: 100%; }
.aa-fab { position: absolute; right: 16px; bottom: 78px; z-index: 20; width: 54px; height: 54px; border-radius: 50%; background: var(--brass); color: var(--bg); border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.4); cursor: pointer; }
.aa-tabbar { display: flex; border-top: 1px solid var(--border); background: var(--surface); flex-shrink: 0; }
.aa-tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 9px 0 10px; background: none; border: none; color: var(--text-dim); font-size: 10.5px; font-weight: 600; cursor: pointer; }
.aa-tab.is-active { color: var(--brass); }
@media (prefers-reduced-motion: reduce) { .aa-spin { animation: none; } }
`
