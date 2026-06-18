import { useState, useEffect, useMemo } from 'react'
import {
  Plus, Hammer, Banknote, ListChecks, CalendarDays, Users, Wallet,
  Check, X, Clock, MapPin, Phone, Trash2, ChevronLeft, ChevronRight,
  AlertTriangle, Pencil, Sun, HardHat, UserPlus, Lock,
  MessageCircle, UserCheck, Megaphone, Receipt, Tag, ArrowRightCircle,
} from 'lucide-react'

const PANEL_PASSWORD = 'provenza2024'
const SESSION_KEY = 'provenza_panel_auth'

const pad = (n: number) => String(n).padStart(2, '0')
const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
const parseISODate = (s: string) => { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d) }
const addDays = (s: string, n: number) => { const d = parseISODate(s); d.setDate(d.getDate()+n); return toISODate(d) }
const todayISO = () => toISODate(new Date())
const startOfWeek = (s: string) => { const d = parseISODate(s); const day = d.getDay(); const diff = day===0?-6:1-day; d.setDate(d.getDate()+diff); return toISODate(d) }
const weekDaysOf = (s: string) => { const start = startOfWeek(s); return Array.from({length:7},(_,i)=>addDays(start,i)) }
const dayLabel = (s: string) => { const d = parseISODate(s); const t = d.toLocaleDateString('es-ES',{weekday:'short'}).replace('.',''); return t.charAt(0).toUpperCase()+t.slice(1) }
const dayNum = (s: string) => parseISODate(s).getDate()
const longLabel = (s: string) => { const d = parseISODate(s); const t = d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}); return t.charAt(0).toUpperCase()+t.slice(1) }
const daysAgo = (s: string) => Math.round((parseISODate(todayISO()).getTime()-parseISODate(s).getTime())/86400000)
const monthKey = (s: string) => s.slice(0,7)
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2)
const fmt = (n: number|string) => Number(n).toLocaleString('es-ES',{minimumFractionDigits:2})
const waLink = (telefono: string, mensaje: string) => { let n=(telefono||'').replace(/\D/g,''); if(n.length===9) n='34'+n; return `https://wa.me/${n}?text=${encodeURIComponent(mensaje)}` }

const GREMIOS_SUGERIDOS = ['Albañilería','Electricidad','Fontanería','Pintura','Carpintería','Climatización','Cerrajería','Solados','Pladur / Yesos']
const ESTADOS_OBRA = ['En curso','Pausada','Terminada']
const ESTADOS_PRESUPUESTO = ['Borrador','Enviado','Aceptado','Rechazado']
const UNIDADES = ['ud','m²','m','h','global']

interface Cliente { id:string; nombre:string; telefono:string; direccion:string; frecuencia:string; notas:string }
interface Visita { id:string; clienteId:string; fecha:string; hora:string; tipo:string; direccion:string; notas:string; estado:string; _type?:string }
interface Cobro { id:string; clienteId:string; fecha:string; hora:string; importe:number; metodo:string; estado:string; _type?:string }
interface Tarea { id:string; descripcion:string; fecha:string; completada:boolean }
interface Empleado { id:string; nombre:string; telefono:string; tipoPago:'hora'|'dia'|'fijo'; tarifa:number }
interface Pago { id:string; empleadoId:string; fecha:string; importe:number; concepto:string }
interface Jornada { id:string; empleadoId:string; fecha:string; pagado:boolean }
interface Obra { id:string; nombre:string; cliente:string; direccion:string; estado:string; fechaInicio:string; notas:string }
interface ObraItem { id:string; obraId:string; descripcion:string; gremio:string; completado:boolean }
interface Asignacion { id:string; obraId:string; empleadoId:string; fecha:string; notas:string }
interface Lead { id:string; nombre:string; telefono:string; gremio:string; mensaje:string; estado:'nuevo'|'contactado'|'convertido'|'descartado'; fecha:string }
interface Presupuesto { id:string; clienteId:string; nombre:string; estado:string; fecha:string; notas:string; iva:boolean }
interface PresupuestoLinea { id:string; presupuestoId:string; concepto:string; gremio:string; cantidad:number; unidad:string; precioUnitario:number }

const KEYS = ['clientes','visitas','cobros','tareas','empleados','pagos','jornadas','obras','obraitems','asignaciones','leads','presupuestos','presupuestolineas']
function loadAll(): Record<string,unknown[]> {
  const out: Record<string,unknown[]> = {}
  KEYS.forEach(k => { try { const r = localStorage.getItem('provenza_panel_'+k); out[k]=r?JSON.parse(r):[] } catch { out[k]=[] } })
  return out
}
function persist(key: string, data: unknown[]) {
  try { localStorage.setItem('provenza_panel_'+key, JSON.stringify(data)) } catch(e) { console.error('storage',key,e) }
}

function LoginGate({ onAuth }: { onAuth: ()=>void }) {
  const [pwd,setPwd] = useState('')
  const [error,setError] = useState(false)
  const submit = () => { if(pwd===PANEL_PASSWORD){sessionStorage.setItem(SESSION_KEY,'1');onAuth()}else{setError(true);setPwd('');setTimeout(()=>setError(false),1800)} }
  return (
    <div style={{position:'fixed',inset:0,background:'#1B1F23',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Sans:wght@400;500&display=swap');`}</style>
      <div style={{width:'100%',maxWidth:340,padding:'0 24px'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(201,162,39,0.15)',border:'1px solid #C9A227',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',color:'#C9A227'}}><Lock size={20}/></div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:11,fontWeight:700,letterSpacing:'0.18em',color:'#C9A227',marginBottom:6}}>MULTISERVICIOS PROVENZA</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:600,color:'#F2EEE4'}}>Panel de gestión</div>
        </div>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Contraseña" autoFocus
          style={{width:'100%',padding:'12px 14px',background:'#242A33',border:`1px solid ${error?'#E2625A':'#3A4250'}`,borderRadius:9,color:'#F2EEE4',fontSize:15,fontFamily:'inherit',marginBottom:10,outline:'none'}}/>
        {error&&<div style={{color:'#E2625A',fontSize:12,marginBottom:10,textAlign:'center'}}>Contraseña incorrecta</div>}
        <button onClick={submit} style={{width:'100%',padding:13,background:'#C9A227',border:'none',borderRadius:9,color:'#1B1F23',fontWeight:700,fontSize:14,cursor:'pointer'}}>Entrar</button>
      </div>
    </div>
  )
}

function Stamp({children,tone='brass',small}:{children:React.ReactNode;tone?:string;small?:boolean}) {
  return <div className={`aa-stamp aa-stamp--${tone}${small?' aa-stamp--sm':''}`}>{children}</div>
}
function DeleteButton({onConfirm,label=''}:{onConfirm:()=>void;label?:string}) {
  const [armed,setArmed] = useState(false)
  useEffect(()=>{if(!armed)return;const t=setTimeout(()=>setArmed(false),2500);return()=>clearTimeout(t)},[armed])
  if(armed) return <button className="aa-iconbtn aa-iconbtn--danger" onClick={()=>{setArmed(false);onConfirm()}}><Check size={15}/></button>
  return <button className="aa-iconbtn" onClick={()=>setArmed(true)} title={`Eliminar ${label}`}><Trash2 size={15}/></button>
}
function EmptyState({text}:{text:string}){return <div className="aa-empty">{text}</div>}

function DayAgenda({date,data,onToggleEstado,onToggleTarea,onDelete}:{date:string;data:{clientes:Cliente[];visitas:Visita[];cobros:Cobro[];tareas:Tarea[]};onToggleEstado:(t:string,id:string)=>void;onToggleTarea:(id:string)=>void;onDelete:(col:string,id:string)=>void}) {
  const {clientes,visitas,cobros,tareas} = data
  const clienteName = (id:string) => clientes.find(c=>c.id===id)?.nombre||'Cliente'
  const sueltas = tareas.filter(t=>t.fecha===date)
  const vis = visitas.filter(v=>v.fecha===date).map(v=>({...v,_type:'visita'}))
  const cob = cobros.filter(c=>c.fecha===date).map(c=>({...c,_type:'cobro'}))
  const timed = [...vis,...cob].sort((a,b)=>(a.hora||'99:99').localeCompare(b.hora||'99:99'))
  if(!timed.length&&!sueltas.length) return <EmptyState text="Nada agendado este día. Pulsa + para apuntar una visita, un cobro o una tarea."/>
  return (
    <div className="aa-daylist">
      {sueltas.length>0&&<div className="aa-task-row-group">{sueltas.map(t=>(
        <div key={t.id} className={`aa-taskrow${t.completada?' is-done':''}`}>
          <button className="aa-checkbox" onClick={()=>onToggleTarea(t.id)}>{t.completada?<Check size={13}/>:null}</button>
          <span className="aa-taskrow__text">{t.descripcion}</span>
          <DeleteButton onConfirm={()=>onDelete('tareas',t.id)} label="tarea"/>
        </div>
      ))}</div>}
      {timed.map(item=>{
        const isV=item._type==='visita'; const tone=isV?'water':'money'
        const done=isV?item.estado==='realizado':item.estado==='cobrado'
        return (
          <div key={item.id} className={`aa-ticket aa-ticket--${tone}${done?' is-done':''}`}>
            <Stamp tone={tone}>{item.hora||'--:--'}</Stamp>
            <div className="aa-ticket__body">
              <div className="aa-ticket__top">
                <span className="aa-ticket__icon">{isV?<Hammer size={14}/>:<Banknote size={14}/>}</span>
                <span className="aa-ticket__client">{clienteName(item.clienteId)}</span>
              </div>
              {isV?(
                <div className="aa-ticket__meta">
                  <span className="aa-tag">{(item as Visita).tipo}</span>
                  {(item as Visita).direccion&&<span className="aa-ticket__sub"><MapPin size={11}/> {(item as Visita).direccion}</span>}
                  {(item as Visita).notas&&<span className="aa-ticket__notas">{(item as Visita).notas}</span>}
                </div>
              ):(
                <div className="aa-ticket__meta">
                  <span className="aa-tag aa-tag--money">{Number((item as Cobro).importe).toLocaleString('es-ES',{minimumFractionDigits:2})} €</span>
                  <span className="aa-ticket__sub">{(item as Cobro).metodo}</span>
                </div>
              )}
            </div>
            <div className="aa-ticket__actions">
              <button className="aa-iconbtn aa-iconbtn--ok" onClick={()=>onToggleEstado(item._type!,item.id)}><Check size={15}/></button>
              <DeleteButton onConfirm={()=>onDelete(isV?'visitas':'cobros',item.id)} label={isV?'visita':'cobro'}/>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AddSheet({open,onClose,clientes,defaultDate,onCreate}:{open:boolean;onClose:()=>void;clientes:Cliente[];defaultDate:string;onCreate:(type:string,payload:Record<string,unknown>)=>void}) {
  const [step,setStep] = useState<string|null>(null)
  const [form,setForm] = useState<Record<string,string>>({})
  useEffect(()=>{if(open){setStep(null);setForm({fecha:defaultDate,hora:'09:00'})}},[open,defaultDate])
  if(!open) return null
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}))
  const submit=()=>{
    if(step==='tarea'){if(!form.descripcion?.trim())return;onCreate('tarea',{descripcion:form.descripcion.trim(),fecha:form.fecha||defaultDate})}
    else if(step==='visita'){if(!form.cliente?.trim()||!form.fecha)return;onCreate('visita',{clienteNombre:form.cliente.trim(),fecha:form.fecha,hora:form.hora||'',tipo:form.tipo||'Presupuesto',direccion:form.direccion||'',notas:form.notas||''})}
    else if(step==='cobro'){if(!form.cliente?.trim()||!form.fecha||!form.importe)return;onCreate('cobro',{clienteNombre:form.cliente.trim(),fecha:form.fecha,hora:form.hora||'',importe:Number(form.importe),metodo:form.metodo||'Efectivo'})}
    onClose()
  }
  return (
    <div className="aa-overlay" onClick={onClose}>
      <div className="aa-sheet" onClick={e=>e.stopPropagation()}>
        <div className="aa-sheet__handle"/>
        {!step&&<><div className="aa-sheet__title">¿Qué quieres apuntar?</div><div className="aa-choicegrid"><button className="aa-choice aa-choice--water" onClick={()=>setStep('visita')}><Hammer size={22}/><span>Visita</span></button><button className="aa-choice aa-choice--money" onClick={()=>setStep('cobro')}><Banknote size={22}/><span>Cobro</span></button><button className="aa-choice aa-choice--task" onClick={()=>setStep('tarea')}><ListChecks size={22}/><span>Tarea</span></button></div></>}
        {step==='visita'&&<><div className="aa-sheet__title">Nueva visita</div><label className="aa-label">Cliente</label><input className="aa-input" list="aa-cl" value={form.cliente||''} onChange={e=>set('cliente',e.target.value)} placeholder="Nombre"/><datalist id="aa-cl">{clientes.map(c=><option key={c.id} value={c.nombre}/>)}</datalist><div className="aa-row2"><div><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={form.fecha} onChange={e=>set('fecha',e.target.value)}/></div><div><label className="aa-label">Hora</label><input type="time" className="aa-input" value={form.hora} onChange={e=>set('hora',e.target.value)}/></div></div><label className="aa-label">Tipo</label><select className="aa-input" value={form.tipo||'Presupuesto'} onChange={e=>set('tipo',e.target.value)}><option>Presupuesto</option><option>Reparación</option><option>Revisión</option><option>Mantenimiento</option></select><label className="aa-label">Dirección</label><input className="aa-input" value={form.direccion||''} onChange={e=>set('direccion',e.target.value)}/><label className="aa-label">Notas</label><textarea className="aa-input aa-textarea" value={form.notas||''} onChange={e=>set('notas',e.target.value)}/><button className="aa-submit aa-submit--water" onClick={submit}>Guardar visita</button></>}
        {step==='cobro'&&<><div className="aa-sheet__title">Nuevo cobro</div><label className="aa-label">Cliente</label><input className="aa-input" list="aa-cl" value={form.cliente||''} onChange={e=>set('cliente',e.target.value)} placeholder="Nombre"/><datalist id="aa-cl">{clientes.map(c=><option key={c.id} value={c.nombre}/>)}</datalist><div className="aa-row2"><div><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={form.fecha} onChange={e=>set('fecha',e.target.value)}/></div><div><label className="aa-label">Hora</label><input type="time" className="aa-input" value={form.hora} onChange={e=>set('hora',e.target.value)}/></div></div><label className="aa-label">Importe (€)</label><input type="number" className="aa-input" value={form.importe||''} onChange={e=>set('importe',e.target.value)}/><label className="aa-label">Método</label><select className="aa-input" value={form.metodo||'Efectivo'} onChange={e=>set('metodo',e.target.value)}><option>Efectivo</option><option>Transferencia</option><option>Bizum</option></select><button className="aa-submit aa-submit--money" onClick={submit}>Guardar cobro</button></>}
        {step==='tarea'&&<><div className="aa-sheet__title">Nueva tarea</div><label className="aa-label">Descripción</label><input className="aa-input" value={form.descripcion||''} onChange={e=>set('descripcion',e.target.value)}/><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={form.fecha} onChange={e=>set('fecha',e.target.value)}/><button className="aa-submit aa-submit--task" onClick={submit}>Guardar tarea</button></>}
        <button className="aa-sheet__close" onClick={onClose}><X size={16}/> Cerrar</button>
      </div>
    </div>
  )
}

function ClientesView({clientes,visitas,leads,onAddCliente,onDeleteCliente,onUpdateCliente,onAddLead,onSetLeadEstado,onDeleteLead,onConvertLead}:{clientes:Cliente[];visitas:Visita[];leads:Lead[];onAddCliente:(d:Partial<Cliente>)=>void;onDeleteCliente:(id:string)=>void;onUpdateCliente:(id:string,d:Partial<Cliente>)=>void;onAddLead:(d:Partial<Lead>)=>void;onSetLeadEstado:(id:string,e:string)=>void;onDeleteLead:(id:string)=>void;onConvertLead:(l:Lead)=>void}) {
  const [subView,setSubView] = useState('clientes')
  const [showForm,setShowForm] = useState(false)
  const [editing,setEditing] = useState<string|null>(null)
  const [form,setForm] = useState<Record<string,string>>({})
  const [showLeadForm,setShowLeadForm] = useState(false)
  const [leadForm,setLeadForm] = useState<Record<string,string>>({})
  const openEdit=(c:Cliente)=>{setForm(c as unknown as Record<string,string>);setEditing(c.id);setShowForm(true)}
  const submit=()=>{if(!form.nombre?.trim())return;if(editing)onUpdateCliente(editing,form);else onAddCliente(form);setShowForm(false)}
  const submitLead=()=>{if(!leadForm.nombre?.trim())return;onAddLead(leadForm);setLeadForm({});setShowLeadForm(false)}
  const stats=useMemo(()=>clientes.map(c=>{const vs=visitas.filter(v=>v.clienteId===c.id).sort((a,b)=>b.fecha.localeCompare(a.fecha));const last=vs[0]?.fecha;const fn=Number(c.frecuencia);let overdue=false;if(last&&fn>0){const exp=Math.round(7/fn);overdue=daysAgo(last)>exp*1.6}return{...c,lastVisit:last,overdue}}),[clientes,visitas])
  const leadsActivos=leads.filter(l=>l.estado==='nuevo'||l.estado==='contactado')
  const leadsArchivados=leads.filter(l=>l.estado==='convertido'||l.estado==='descartado')
  const nuevosCount=leads.filter(l=>l.estado==='nuevo').length
  const ELABEL:{[k:string]:string}={nuevo:'Nuevo',contactado:'Contactado',convertido:'Convertido',descartado:'Descartado'}
  return (
    <div className="aa-view">
      <div className="aa-subtabs">
        <button className={`aa-subtab${subView==='clientes'?' is-active':''}`} onClick={()=>setSubView('clientes')}>Clientes</button>
        <button className={`aa-subtab${subView==='leads'?' is-active':''}`} onClick={()=>setSubView('leads')}>Leads {nuevosCount>0&&<span className="aa-subtab__badge">{nuevosCount}</span>}</button>
      </div>
      {subView==='clientes'&&<><div className="aa-viewheader"><span>Clientes</span><button className="aa-addsmall" onClick={()=>{setForm({});setEditing(null);setShowForm(true)}}><Plus size={14}/> Cliente</button></div>{stats.length===0&&<EmptyState text="Sin clientes todavía."/>}<div className="aa-clientlist">{stats.map(c=>(<div key={c.id} className="aa-clientcard" onClick={()=>openEdit(c)}><div className="aa-clientcard__top"><span className="aa-clientcard__name">{c.nombre}</span>{c.overdue&&<span className="aa-flag"><AlertTriangle size={12}/> atrasado</span>}</div><div className="aa-clientcard__row">{c.telefono&&<span><Phone size={11}/> {c.telefono}</span>}{c.frecuencia&&<span className="aa-tag">{c.frecuencia}x/semana</span>}</div>{c.lastVisit?<div className="aa-clientcard__sub">Última visita: hace {daysAgo(c.lastVisit)} días</div>:<div className="aa-clientcard__sub">Sin visitas todavía</div>}</div>))}</div></>}
      {subView==='leads'&&<><div className="aa-viewheader"><span>Leads</span><button className="aa-addsmall" onClick={()=>setShowLeadForm(true)}><Plus size={14}/> Lead</button></div>{!leadsActivos.length&&!leadsArchivados.length&&<EmptyState text="Sin solicitudes todavía."/>}<div className="aa-clientlist">{leadsActivos.map(l=>(<div key={l.id} className="aa-clientcard"><div className="aa-clientcard__top"><span className="aa-clientcard__name">{l.nombre}</span><span className={`aa-tag${l.estado==='nuevo'?' aa-tag--estado-encurso':' aa-tag--gremio'}`}>{ELABEL[l.estado]}</span></div><div className="aa-clientcard__row">{l.telefono&&<span><Phone size={11}/> {l.telefono}</span>}{l.gremio&&<span className="aa-tag aa-tag--gremio">{l.gremio}</span>}</div>{l.mensaje&&<div className="aa-clientcard__sub">{l.mensaje}</div>}<div className="aa-leadactions">{l.estado==='nuevo'&&<button className="aa-addsmall" onClick={()=>onSetLeadEstado(l.id,'contactado')}>Marcar contactado</button>}<button className="aa-addsmall aa-addsmall--brass" onClick={()=>onConvertLead(l)}><UserCheck size={13}/> Convertir en cliente</button><button className="aa-addsmall" onClick={()=>onSetLeadEstado(l.id,'descartado')}>Descartar</button><DeleteButton onConfirm={()=>onDeleteLead(l.id)} label="lead"/></div></div>))}{leadsArchivados.length>0&&<><div className="aa-obrablock__title" style={{marginTop:10}}>Archivados</div>{leadsArchivados.map(l=>(<div key={l.id} className="aa-clientcard" style={{opacity:0.6}}><div className="aa-clientcard__top"><span className="aa-clientcard__name">{l.nombre}</span><span className="aa-tag aa-tag--gremio">{ELABEL[l.estado]}</span></div><DeleteButton onConfirm={()=>onDeleteLead(l.id)} label="lead"/></div>))}</>}</div></>}
      {showForm&&<div className="aa-overlay" onClick={()=>setShowForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}><div className="aa-sheet__handle"/><div className="aa-sheet__title">{editing?'Editar cliente':'Nuevo cliente'}</div><label className="aa-label">Nombre</label><input className="aa-input" value={form.nombre||''} onChange={e=>setForm({...form,nombre:e.target.value})}/><label className="aa-label">Teléfono</label><input className="aa-input" value={form.telefono||''} onChange={e=>setForm({...form,telefono:e.target.value})}/><label className="aa-label">Dirección</label><input className="aa-input" value={form.direccion||''} onChange={e=>setForm({...form,direccion:e.target.value})}/><label className="aa-label">Frecuencia estimada (veces/semana)</label><input type="number" className="aa-input" value={form.frecuencia||''} onChange={e=>setForm({...form,frecuencia:e.target.value})}/><label className="aa-label">Notas</label><textarea className="aa-input aa-textarea" value={form.notas||''} onChange={e=>setForm({...form,notas:e.target.value})}/><button className="aa-submit aa-submit--brass" onClick={submit}>Guardar</button>{editing&&<button className="aa-submit aa-submit--danger" onClick={()=>{onDeleteCliente(editing);setShowForm(false)}}>Eliminar cliente</button>}<button className="aa-sheet__close" onClick={()=>setShowForm(false)}><X size={16}/> Cerrar</button></div></div>}
      {showLeadForm&&<div className="aa-overlay" onClick={()=>setShowLeadForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}><div className="aa-sheet__handle"/><div className="aa-sheet__title">Nuevo lead</div><label className="aa-label">Nombre</label><input className="aa-input" value={leadForm.nombre||''} onChange={e=>setLeadForm({...leadForm,nombre:e.target.value})}/><label className="aa-label">Teléfono</label><input className="aa-input" value={leadForm.telefono||''} onChange={e=>setLeadForm({...leadForm,telefono:e.target.value})}/><label className="aa-label">Gremio que pide</label><input className="aa-input" list="aa-gr" value={leadForm.gremio||''} onChange={e=>setLeadForm({...leadForm,gremio:e.target.value})}/><datalist id="aa-gr">{GREMIOS_SUGERIDOS.map(g=><option key={g} value={g}/>)}</datalist><label className="aa-label">Mensaje</label><textarea className="aa-input aa-textarea" value={leadForm.mensaje||''} onChange={e=>setLeadForm({...leadForm,mensaje:e.target.value})}/><button className="aa-submit aa-submit--brass" onClick={submitLead}>Guardar lead</button><button className="aa-sheet__close" onClick={()=>setShowLeadForm(false)}><X size={16}/> Cerrar</button></div></div>}
    </div>
  )
}

function ObrasView({obras,obraitems,asignaciones,empleados,onAddObra,onUpdateObra,onDeleteObra,onAddItem,onToggleItem,onDeleteItem,onAddAsignacion,onDeleteAsignacion}:{obras:Obra[];obraitems:ObraItem[];asignaciones:Asignacion[];empleados:Empleado[];onAddObra:(d:Partial<Obra>)=>void;onUpdateObra:(id:string,d:Partial<Obra>)=>void;onDeleteObra:(id:string)=>void;onAddItem:(obraId:string,d:Partial<ObraItem>)=>void;onToggleItem:(id:string)=>void;onDeleteItem:(id:string)=>void;onAddAsignacion:(obraId:string,d:Partial<Asignacion>)=>void;onDeleteAsignacion:(id:string)=>void}) {
  const [showForm,setShowForm]=useState(false)
  const [editing,setEditing]=useState<string|null>(null)
  const [form,setForm]=useState<Record<string,string>>({})
  const [openId,setOpenId]=useState<string|null>(null)
  const [itemForm,setItemForm]=useState<Record<string,string>>({})
  const [assignForm,setAssignForm]=useState<Record<string,string>>({})
  const openEdit=(o:Obra)=>{setForm(o as unknown as Record<string,string>);setEditing(o.id);setShowForm(true)}
  const submit=()=>{if(!form.nombre?.trim())return;if(editing)onUpdateObra(editing,form);else onAddObra(form);setShowForm(false)}
  const submitItem=(obraId:string)=>{if(!itemForm.descripcion?.trim())return;onAddItem(obraId,{descripcion:itemForm.descripcion.trim(),gremio:itemForm.gremio||''});setItemForm({})}
  const submitAssign=(obraId:string)=>{if(!assignForm.empleadoId)return;onAddAsignacion(obraId,{empleadoId:assignForm.empleadoId,fecha:assignForm.fecha||'',notas:assignForm.notas||''});setAssignForm({})}
  return (
    <div className="aa-view">
      <div className="aa-viewheader"><span>Obras</span><button className="aa-addsmall" onClick={()=>{setForm({estado:'En curso',fechaInicio:todayISO()});setEditing(null);setShowForm(true)}}><Plus size={14}/> Obra</button></div>
      {obras.length===0&&<EmptyState text="Sin obras todavía."/>}
      <div className="aa-clientlist">{obras.map(o=>{
        const items=obraitems.filter(i=>i.obraId===o.id)
        const pend=items.filter(i=>!i.completado)
        const asigs=asignaciones.filter(a=>a.obraId===o.id)
        const open=openId===o.id
        return (
          <div key={o.id} className="aa-clientcard">
            <div className="aa-clientcard__top" onClick={()=>setOpenId(open?null:o.id)} style={{cursor:'pointer'}}>
              <span className="aa-clientcard__name">{o.nombre}</span>
              <span className={`aa-tag aa-tag--estado-${(o.estado||'').toLowerCase().replace(/\s/g,'')}`}>{o.estado||'En curso'}</span>
            </div>
            <div className="aa-clientcard__row">{o.cliente&&<span><Users size={11}/> {o.cliente}</span>}{o.direccion&&<span><MapPin size={11}/> {o.direccion}</span>}</div>
            <div className="aa-clientcard__sub">{items.length===0?'Sin pendientes registrados':`${pend.length} de ${items.length} pendiente${items.length===1?'':'s'}`}{asigs.length>0&&` · ${asigs.length} ${asigs.length===1?'persona asignada':'personas asignadas'}`}</div>
            {open&&<div className="aa-empexpand">
              <button className="aa-addsmall" onClick={()=>openEdit(o)}><Pencil size={13}/> Editar obra</button>
              <div className="aa-obrablock"><div className="aa-obrablock__title">Qué falta</div>{items.length===0&&<div className="aa-empty aa-empty--tight">Nada apuntado todavía.</div>}<div className="aa-task-row-group">{items.map(it=>(<div key={it.id} className={`aa-taskrow${it.completado?' is-done':''}`}><button className="aa-checkbox" onClick={()=>onToggleItem(it.id)}>{it.completado?<Check size={13}/>:null}</button><span className="aa-taskrow__text">{it.gremio&&<span className="aa-tag aa-tag--gremio">{it.gremio}</span>} {it.descripcion}</span><DeleteButton onConfirm={()=>onDeleteItem(it.id)} label="pendiente"/></div>))}</div><div className="aa-inlineform"><input className="aa-input" value={itemForm.descripcion||''} onChange={e=>setItemForm({...itemForm,descripcion:e.target.value})} placeholder="Qué falta por hacer"/><input className="aa-input" list="aa-gr2" value={itemForm.gremio||''} onChange={e=>setItemForm({...itemForm,gremio:e.target.value})} placeholder="Gremio (opcional)"/><datalist id="aa-gr2">{GREMIOS_SUGERIDOS.map(g=><option key={g} value={g}/>)}</datalist><button className="aa-addsmall" onClick={()=>submitItem(o.id)}><Plus size={13}/> Añadir pendiente</button></div></div>
              <div className="aa-obrablock"><div className="aa-obrablock__title">Quién va</div>{asigs.length===0&&<div className="aa-empty aa-empty--tight">Nadie asignado todavía.</div>}<div className="aa-paylist">{asigs.map(a=>{const emp=empleados.find(e=>e.id===a.empleadoId);const pd=items.filter(i=>!i.completado).slice(0,4).map(i=>i.descripcion).join(', ');const msg=`Hola ${emp?.nombre||''}, te necesito en *${o.nombre}*${o.direccion?` (${o.direccion})`:''}${a.fecha?` el ${a.fecha}`:''}.${a.notas?` Tarea: ${a.notas}.`:''}${pd?` Pendiente: ${pd}`:''}`; return(<div key={a.id} className="aa-payrow"><span className="aa-payrow__concepto">{emp?.nombre||'Empleado'}{a.notas?` · ${a.notas}`:''}</span><span className="aa-payrow__date">{a.fecha||'sin fecha'}</span>{emp?.telefono&&<a className="aa-iconbtn" href={waLink(emp.telefono,msg)} target="_blank" rel="noopener noreferrer"><MessageCircle size={14}/></a>}<DeleteButton onConfirm={()=>onDeleteAsignacion(a.id)} label="asignación"/></div>)})}</div>{empleados.length===0?<div className="aa-empty aa-empty--tight">Añade empleados en Equipo.</div>:<div className="aa-inlineform"><select className="aa-input" value={assignForm.empleadoId||''} onChange={e=>setAssignForm({...assignForm,empleadoId:e.target.value})}><option value="">Elegir empleado…</option>{empleados.map(e=><option key={e.id} value={e.id}>{e.nombre}</option>)}</select><input type="date" className="aa-input" value={assignForm.fecha||''} onChange={e=>setAssignForm({...assignForm,fecha:e.target.value})}/><input className="aa-input" value={assignForm.notas||''} onChange={e=>setAssignForm({...assignForm,notas:e.target.value})} placeholder="Para qué (opcional)"/><button className="aa-addsmall" onClick={()=>submitAssign(o.id)}><UserPlus size={13}/> Asignar</button></div>}</div>
              <DeleteButton onConfirm={()=>onDeleteObra(o.id)} label="obra"/>
            </div>}
          </div>
        )
      })}</div>
      {showForm&&<div className="aa-overlay" onClick={()=>setShowForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}><div className="aa-sheet__handle"/><div className="aa-sheet__title">{editing?'Editar obra':'Nueva obra'}</div><label className="aa-label">Nombre</label><input className="aa-input" value={form.nombre||''} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Ej. Reforma piso C/ Mayor 12"/><label className="aa-label">Cliente</label><input className="aa-input" value={form.cliente||''} onChange={e=>setForm({...form,cliente:e.target.value})}/><label className="aa-label">Dirección</label><input className="aa-input" value={form.direccion||''} onChange={e=>setForm({...form,direccion:e.target.value})}/><div className="aa-row2"><div><label className="aa-label">Estado</label><select className="aa-input" value={form.estado||'En curso'} onChange={e=>setForm({...form,estado:e.target.value})}>{ESTADOS_OBRA.map(s=><option key={s}>{s}</option>)}</select></div><div><label className="aa-label">Fecha inicio</label><input type="date" className="aa-input" value={form.fechaInicio||''} onChange={e=>setForm({...form,fechaInicio:e.target.value})}/></div></div><label className="aa-label">Notas</label><textarea className="aa-input aa-textarea" value={form.notas||''} onChange={e=>setForm({...form,notas:e.target.value})}/><button className="aa-submit aa-submit--brass" onClick={submit}>Guardar</button>{editing&&<button className="aa-submit aa-submit--danger" onClick={()=>{onDeleteObra(editing);setShowForm(false)}}>Eliminar obra</button>}<button className="aa-sheet__close" onClick={()=>setShowForm(false)}><X size={16}/> Cerrar</button></div></div>}
    </div>
  )
}

interface CatalogoItem { concepto:string; gremio:string; unidad:string; ultimoPrecio:number; promedio:number; vecesUsado:number; precios:number[]; ultimaFecha:string }

function PresupuestoEditorView({presupuesto,lineas,clientes,catalogo,onSaveAndClose,onSavePresupuesto,onAddLinea,onDeleteLinea,onClose}:{presupuesto:Presupuesto|null;lineas:PresupuestoLinea[];clientes:Cliente[];catalogo:CatalogoItem[];onSaveAndClose:(form:Record<string,unknown>,lineas:PresupuestoLinea[])=>void;onSavePresupuesto?:(id:string,d:Partial<Presupuesto>)=>void;onAddLinea:(d:Omit<PresupuestoLinea,'id'|'presupuestoId'>)=>void;onDeleteLinea:(id:string)=>void;onClose:()=>void}) {
  const isNew=!presupuesto
  const [form,setForm]=useState<Record<string,unknown>>(isNew?{nombre:'',clienteNombre:'',estado:'Borrador',fecha:todayISO(),notas:'',iva:false}:{nombre:presupuesto!.nombre,estado:presupuesto!.estado,fecha:presupuesto!.fecha,notas:presupuesto!.notas||'',iva:presupuesto!.iva||false})
  const [localLineas,setLocalLineas]=useState<PresupuestoLinea[]>([])
  const [lf,setLf]=useState({concepto:'',gremio:'',cantidad:'1',unidad:'ud',precioUnitario:''})
  const set=(k:string,v:unknown)=>setForm(f=>({...f,[k]:v}))
  const sl=(k:string,v:string)=>setLf(f=>({...f,[k]:v}))
  const displayLineas=isNew?localLineas:lineas
  const onConceptoChange=(val:string)=>{sl('concepto',val);const match=catalogo.find(c=>c.concepto.toLowerCase()===val.trim().toLowerCase());if(match)setLf(f=>({...f,concepto:val,precioUnitario:f.precioUnitario||String(match.ultimoPrecio),gremio:f.gremio||match.gremio||'',unidad:f.unidad!=='ud'?f.unidad:(match.unidad||'ud')}))}
  const handleAddLinea=()=>{if(!lf.concepto?.trim()||!lf.precioUnitario)return;const linea={concepto:lf.concepto.trim(),gremio:lf.gremio||'',cantidad:Number(lf.cantidad)||1,unidad:lf.unidad||'ud',precioUnitario:Number(lf.precioUnitario)};if(isNew)setLocalLineas(p=>[...p,{...linea,id:uid(),presupuestoId:''}]);else onAddLinea(linea);setLf({concepto:'',gremio:lf.gremio,cantidad:'1',unidad:lf.unidad,precioUnitario:''})}
  const handleDeleteLinea=(id:string)=>{if(isNew)setLocalLineas(p=>p.filter(l=>l.id!==id));else onDeleteLinea(id)}
  const handleSave=()=>{if(!(form.nombre as string)?.trim())return;if(isNew){if(!(form.clienteNombre as string)?.trim())return;onSaveAndClose(form,localLineas)}else{onSavePresupuesto!(presupuesto!.id,form as Partial<Presupuesto>);onClose()}}
  const byGremio=useMemo(()=>{const g:Record<string,PresupuestoLinea[]>={};displayLineas.forEach(l=>{const k=l.gremio||'Sin gremio';if(!g[k])g[k]=[];g[k].push(l)});return g},[displayLineas])
  const totalByGremio=useMemo(()=>{const r:Record<string,number>={};Object.entries(byGremio).forEach(([k,ls])=>{r[k]=ls.reduce((s,l)=>s+(Number(l.cantidad)||0)*(Number(l.precioUnitario)||0),0)});return r},[byGremio])
  const subtotal=Object.values(totalByGremio).reduce((s,v)=>s+v,0)
  const ivaAmt=form.iva?subtotal*0.21:0
  const grandTotal=subtotal+ivaAmt
  const clienteNombre=isNew?String(form.clienteNombre||''):(clientes.find(c=>c.id===presupuesto!.clienteId)?.nombre||'')
  return (
    <div className="aa-editor-view">
      <div className="aa-editor-header">
        <button className="aa-iconbtn" onClick={onClose}><ChevronLeft size={18}/></button>
        <span className="aa-editor-title">{isNew?'Nuevo presupuesto':String(form.nombre||'Presupuesto')}</span>
        <button className="aa-addsmall aa-addsmall--brass" onClick={handleSave}><Check size={13}/> Guardar</button>
      </div>
      <div className="aa-editor-body">
        <div className="aa-editor-card">
          <div className="aa-obrablock__title">Datos del presupuesto</div>
          <label className="aa-label">Nombre / título</label>
          <input className="aa-input" value={String(form.nombre||'')} onChange={e=>set('nombre',e.target.value)} placeholder="Ej. Reforma baño C/ Mayor 12"/>
          <label className="aa-label">Cliente</label>
          {isNew?<><input className="aa-input" list="aa-edc" value={String(form.clienteNombre||'')} onChange={e=>set('clienteNombre',e.target.value)} placeholder="Nombre del cliente"/><datalist id="aa-edc">{clientes.map(c=><option key={c.id} value={c.nombre}/>)}</datalist></>:<input className="aa-input" value={clienteNombre} readOnly style={{opacity:0.65}}/>}
          <div className="aa-row2"><div><label className="aa-label">Estado</label><select className="aa-input" value={String(form.estado||'')} onChange={e=>set('estado',e.target.value)}>{ESTADOS_PRESUPUESTO.map(s=><option key={s}>{s}</option>)}</select></div><div><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={String(form.fecha||'')} onChange={e=>set('fecha',e.target.value)}/></div></div>
          <label className="aa-label">Notas / condiciones</label>
          <textarea className="aa-input aa-textarea" value={String(form.notas||'')} onChange={e=>set('notas',e.target.value)} placeholder="Plazo, forma de pago…"/>
        </div>
        <div className="aa-editor-card">
          <div className="aa-obrablock__title">Partidas</div>
          {displayLineas.length===0&&<div className="aa-empty aa-empty--tight">Añade la primera partida abajo.</div>}
          {Object.entries(byGremio).map(([gremio,ls])=>(
            <div key={gremio} className="aa-gremio-block">
              <div className="aa-gremio-block__header"><span className="aa-tag aa-tag--gremio">{gremio}</span><span className="aa-gremio-total">{fmt(totalByGremio[gremio])} €</span></div>
              {ls.map(l=>(<div key={l.id} className="aa-linea-row"><div className="aa-linea-main"><span className="aa-linea-concepto">{l.concepto}</span><span className="aa-linea-qty">{l.cantidad} {l.unidad} × {fmt(l.precioUnitario)} €/ud</span></div><div className="aa-linea-right"><span className="aa-linea-total">{fmt(Number(l.cantidad)*Number(l.precioUnitario))} €</span><DeleteButton onConfirm={()=>handleDeleteLinea(l.id)} label="partida"/></div></div>))}
            </div>
          ))}
          <div className="aa-addlinea-form">
            <div className="aa-obrablock__title" style={{marginTop:14}}>Añadir partida</div>
            <input className="aa-input" list="aa-edco" value={lf.concepto} onChange={e=>onConceptoChange(e.target.value)} placeholder="Concepto, ej. Pintura interior"/>
            <datalist id="aa-edco">{catalogo.map(c=><option key={c.concepto} value={c.concepto}/>)}</datalist>
            <input className="aa-input" list="aa-edgr" value={lf.gremio} onChange={e=>sl('gremio',e.target.value)} placeholder="Gremio (opcional)" style={{marginTop:6}}/>
            <datalist id="aa-edgr">{GREMIOS_SUGERIDOS.map(g=><option key={g} value={g}/>)}</datalist>
            <div className="aa-row2" style={{marginTop:6}}>
              <input type="number" className="aa-input" value={lf.cantidad} onChange={e=>sl('cantidad',e.target.value)} placeholder="Cant."/>
              <select className="aa-input" value={lf.unidad} onChange={e=>sl('unidad',e.target.value)}>{UNIDADES.map(u=><option key={u}>{u}</option>)}</select>
            </div>
            <input type="number" className="aa-input" value={lf.precioUnitario} onChange={e=>sl('precioUnitario',e.target.value)} placeholder="Precio por unidad (€)" style={{marginTop:6}}/>
            <button className="aa-addsmall" style={{marginTop:8}} onClick={handleAddLinea}><Plus size={13}/> Añadir partida</button>
          </div>
        </div>
        {displayLineas.length>0&&<div className="aa-editor-card aa-summary-card">
          <div className="aa-obrablock__title">Resumen económico</div>
          <div className="aa-summary-rows">{Object.entries(totalByGremio).map(([g,t])=>(<div key={g} className="aa-summary-row"><span className="aa-summary-gremio">{g}</span><span>{fmt(t)} €</span></div>))}</div>
          <div className="aa-summary-divider"/>
          <div className="aa-summary-row"><span>Subtotal</span><strong>{fmt(subtotal)} €</strong></div>
          <label className="aa-summary-row aa-summary-iva-row"><span className="aa-summary-iva-label"><input type="checkbox" checked={!!form.iva} onChange={e=>set('iva',e.target.checked)} style={{marginRight:6}}/>Aplicar IVA 21%</span><span>{fmt(ivaAmt)} €</span></label>
          <div className="aa-summary-row aa-summary-total-row"><span>TOTAL</span><strong>{fmt(grandTotal)} €</strong></div>
        </div>}
        <div style={{height:32}}/>
      </div>
    </div>
  )
}

function PresupuestosView({presupuestos,presupuestolineas,clientes,onAddPresupuestoWithLineas,onUpdatePresupuesto,onAddLinea,onDeleteLinea,onConvertirObra}:{presupuestos:Presupuesto[];presupuestolineas:PresupuestoLinea[];clientes:Cliente[];onAddPresupuestoWithLineas:(form:Record<string,unknown>,lineas:PresupuestoLinea[])=>void;onUpdatePresupuesto:(id:string,d:Partial<Presupuesto>)=>void;onAddLinea:(presupuestoId:string,d:Omit<PresupuestoLinea,'id'|'presupuestoId'>)=>void;onDeleteLinea:(id:string)=>void;onConvertirObra:(p:Presupuesto)=>void}) {
  const [subView,setSubView]=useState('presupuestos')
  const [editingId,setEditingId]=useState<string|null>(null)
  const catalogo=useMemo(()=>{const map:Record<string,CatalogoItem&{precios:number[]}>={};presupuestolineas.forEach(l=>{const key=(l.concepto||'').trim().toLowerCase();if(!key)return;const pres=presupuestos.find(p=>p.id===l.presupuestoId);if(!map[key])map[key]={concepto:'',gremio:'',unidad:'',ultimoPrecio:0,promedio:0,vecesUsado:0,precios:[],ultimaFecha:''};map[key].precios.push(Number(l.precioUnitario)||0);map[key].vecesUsado+=1;if(pres&&pres.fecha>=map[key].ultimaFecha){map[key].ultimaFecha=pres.fecha;map[key].concepto=l.concepto.trim();map[key].gremio=l.gremio;map[key].unidad=l.unidad;map[key].ultimoPrecio=Number(l.precioUnitario)||0}});return Object.values(map).map(c=>({...c,promedio:c.precios.reduce((s,x)=>s+x,0)/c.precios.length})).sort((a,b)=>b.vecesUsado-a.vecesUsado)},[presupuestolineas,presupuestos])
  const totalDe=(id:string)=>{const ls=presupuestolineas.filter(l=>l.presupuestoId===id);return ls.reduce((s,l)=>s+(Number(l.cantidad)||0)*(Number(l.precioUnitario)||0),0)}
  if(editingId==='new') return <PresupuestoEditorView presupuesto={null} lineas={[]} clientes={clientes} catalogo={catalogo} onSaveAndClose={(form,ll)=>{onAddPresupuestoWithLineas(form,ll);setEditingId(null)}} onAddLinea={()=>{}} onDeleteLinea={()=>{}} onClose={()=>setEditingId(null)}/>
  if(editingId){const p=presupuestos.find(x=>x.id===editingId);if(!p){setEditingId(null);return null}const lineas=presupuestolineas.filter(l=>l.presupuestoId===editingId);return <PresupuestoEditorView presupuesto={p} lineas={lineas} clientes={clientes} catalogo={catalogo} onSaveAndClose={()=>{}} onSavePresupuesto={onUpdatePresupuesto} onAddLinea={d=>onAddLinea(editingId,d)} onDeleteLinea={onDeleteLinea} onClose={()=>setEditingId(null)}/>}
  return (
    <div className="aa-view">
      <div className="aa-subtabs">
        <button className={`aa-subtab${subView==='presupuestos'?' is-active':''}`} onClick={()=>setSubView('presupuestos')}>Presupuestos</button>
        <button className={`aa-subtab${subView==='catalogo'?' is-active':''}`} onClick={()=>setSubView('catalogo')}>Catálogo de precios</button>
      </div>
      {subView==='presupuestos'&&<><div className="aa-viewheader"><span>Presupuestos</span><button className="aa-addsmall" onClick={()=>setEditingId('new')}><Plus size={14}/> Nuevo</button></div>{presupuestos.length===0&&<EmptyState text="Sin presupuestos todavía."/>}<div className="aa-clientlist">{[...presupuestos].sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(p=>{const sub=totalDe(p.id);const iva=p.iva?sub*0.21:0;const tot=sub+iva;const lc=presupuestolineas.filter(l=>l.presupuestoId===p.id).length;const cn=clientes.find(c=>c.id===p.clienteId)?.nombre||'Sin cliente';return(<div key={p.id} className="aa-clientcard" onClick={()=>setEditingId(p.id)} style={{cursor:'pointer'}}><div className="aa-clientcard__top"><span className="aa-clientcard__name">{p.nombre}</span><span className={`aa-tag aa-tag--estado-${(p.estado||'').toLowerCase()}`}>{p.estado}</span></div><div className="aa-clientcard__row"><span><Users size={11}/> {cn}</span><span>{p.fecha}</span></div><div className="aa-clientcard__sub"><strong>{fmt(tot)} €</strong>{p.iva?' IVA inc.':''} · {lc} {lc===1?'partida':'partidas'}</div>{p.estado==='Aceptado'&&<div style={{marginTop:8}} onClick={e=>e.stopPropagation()}><button className="aa-addsmall aa-addsmall--brass" onClick={()=>onConvertirObra(p)}><ArrowRightCircle size={13}/> Convertir en obra</button></div>}</div>)})}</div></>}
      {subView==='catalogo'&&<><div className="aa-viewheader"><span>Catálogo de precios</span></div>{catalogo.length===0?<EmptyState text="Se llena solo al añadir partidas a los presupuestos."/>:<div className="aa-clientlist">{catalogo.map(c=>(<div key={c.concepto} className="aa-clientcard"><div className="aa-clientcard__top"><span className="aa-clientcard__name"><Tag size={13} style={{marginRight:4,verticalAlign:-2}}/>{c.concepto}</span>{c.gremio&&<span className="aa-tag aa-tag--gremio">{c.gremio}</span>}</div><div className="aa-clientcard__sub">Último: <strong>{fmt(c.ultimoPrecio)} € / {c.unidad}</strong> · Promedio: {fmt(c.promedio)} € · usado {c.vecesUsado} {c.vecesUsado===1?'vez':'veces'}</div></div>))}</div>}</>}
    </div>
  )
}

function EmpleadosView({empleados,pagos,jornadas,onAddEmpleado,onDeleteEmpleado,onAddPago,onCycleJornada,onMarkAllPaid}:{empleados:Empleado[];pagos:Pago[];jornadas:Jornada[];obras:Obra[];obraitems:ObraItem[];asignaciones:Asignacion[];onAddEmpleado:(d:Record<string,string>)=>void;onDeleteEmpleado:(id:string)=>void;onAddPago:(eid:string,d:Omit<Pago,'id'|'empleadoId'>)=>void;onCycleJornada:(eid:string,fecha:string)=>void;onMarkAllPaid:(eid:string)=>void}) {
  const [showForm,setShowForm]=useState(false)
  const [form,setForm]=useState<Record<string,string>>({tipoPago:'hora'})
  const [openId,setOpenId]=useState<string|null>(null)
  const [payForm,setPayForm]=useState<Record<string,string>>({})
  const [showPay,setShowPay]=useState<string|null>(null)
  const [weekDate,setWeekDate]=useState(todayISO())
  const [rangoDesde,setRangoDesde]=useState(todayISO().slice(0,8)+'01')
  const [rangoHasta,setRangoHasta]=useState(todayISO())
  const tipoLabel:{[k:string]:string}={hora:'€ / hora',dia:'€ / día',fijo:'€ / mes'}
  const thisMonth=monthKey(todayISO())
  const week=useMemo(()=>weekDaysOf(weekDate),[weekDate])
  const debeDe=(emp:Empleado)=>{const pend=jornadas.filter(j=>j.empleadoId===emp.id&&!j.pagado).length;const estimado=emp.tipoPago==='dia'?pend*(Number(emp.tarifa)||0):null;return{pend,estimado}}
  const globalStats=useMemo(()=>{let dias=0,estimado=0;empleados.forEach(emp=>{const{pend,estimado:est}=debeDe(emp);dias+=pend;if(est!==null)estimado+=est});return{dias,estimado}},[empleados,jornadas])
  const totalPagadoRango=useMemo(()=>pagos.filter(p=>p.fecha>=rangoDesde&&p.fecha<=rangoHasta).reduce((s,p)=>s+p.importe,0),[pagos,rangoDesde,rangoHasta])
  const submitEmpleado=()=>{if(!form.nombre?.trim())return;onAddEmpleado(form);setForm({tipoPago:'hora'});setShowForm(false)}
  const submitPago=(empId:string)=>{if(!payForm.importe)return;onAddPago(empId,{fecha:payForm.fecha||todayISO(),importe:Number(payForm.importe),concepto:payForm.concepto||''});setPayForm({});setShowPay(null)}
  return (
    <div className="aa-view">
      <div className="aa-viewheader"><span>Equipo</span><button className="aa-addsmall" onClick={()=>setShowForm(true)}><Plus size={14}/> Empleado</button></div>
      <div className="aa-globalcard">
        <div className="aa-globalcard__row"><span className="aa-globalcard__label">Debe el negocio en total</span><span className="aa-globalcard__value aa-globalcard__value--brass">{globalStats.dias} {globalStats.dias===1?'día':'días'} sin pagar{globalStats.estimado>0?` · ~${fmt(globalStats.estimado)} €`:''}</span></div>
        <div className="aa-globalcard__divider"/>
        <div className="aa-globalcard__label" style={{marginBottom:6}}>Total pagado entre fechas</div>
        <div className="aa-globalcard__rangerow"><input type="date" className="aa-input aa-input--sm" value={rangoDesde} onChange={e=>setRangoDesde(e.target.value)}/><span className="aa-globalcard__y">a</span><input type="date" className="aa-input aa-input--sm" value={rangoHasta} onChange={e=>setRangoHasta(e.target.value)}/></div>
        <div className="aa-globalcard__row" style={{marginTop:6}}><span className="aa-globalcard__label">Pagado en ese periodo</span><span className="aa-globalcard__value aa-globalcard__value--money">{fmt(totalPagadoRango)} €</span></div>
      </div>
      {empleados.length===0&&<EmptyState text="Sin empleados todavía."/>}
      <div className="aa-clientlist">{empleados.map(e=>{
        const misPagos=pagos.filter(p=>p.empleadoId===e.id).sort((a,b)=>b.fecha.localeCompare(a.fecha))
        const totalMes=misPagos.filter(p=>monthKey(p.fecha)===thisMonth).reduce((s,p)=>s+p.importe,0)
        const{pend:pendientes,estimado:debeEst}=debeDe(e)
        const open=openId===e.id
        return (
          <div key={e.id} className="aa-clientcard">
            <div className="aa-clientcard__top" onClick={()=>setOpenId(open?null:e.id)} style={{cursor:'pointer'}}>
              <span className="aa-clientcard__name">{e.nombre}</span>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                {pendientes>0&&<span className="aa-flag"><AlertTriangle size={12}/> {pendientes} sin pagar</span>}
                <span className="aa-tag">{e.tarifa} {tipoLabel[e.tipoPago]}</span>
              </div>
            </div>
            <div className="aa-clientcard__sub">Pagado este mes: <strong>{fmt(totalMes)} €</strong></div>
            <div className="aa-clientcard__sub">Se le debe: <strong>{pendientes===0?'nada, al día':`${pendientes} ${pendientes===1?'día':'días'}${debeEst!==null?` · ~${fmt(debeEst)} €`:''}`}</strong></div>
            {e.telefono&&<div className="aa-clientcard__row"><span><Phone size={11}/> {e.telefono}</span></div>}
            {open&&<div className="aa-empexpand">
              <div className="aa-jornadas">
                <div className="aa-jornadas__nav"><button className="aa-iconbtn" onClick={()=>setWeekDate(addDays(weekDate,-7))}><ChevronLeft size={14}/></button><span className="aa-jornadas__label">Semana del {dayNum(week[0])} al {dayNum(week[6])}</span><button className="aa-iconbtn" onClick={()=>setWeekDate(addDays(weekDate,7))}><ChevronRight size={14}/></button></div>
                <div className="aa-jornadas__days">{week.map(d=>{const rec=jornadas.find(j=>j.empleadoId===e.id&&j.fecha===d);const state=!rec?'empty':rec.pagado?'paid':'pending';const isToday=d===todayISO();return(<button key={d} className={`aa-jdaybtn is-${state}${isToday?' is-today':''}`} onClick={()=>onCycleJornada(e.id,d)}><span className="aa-jdaybtn__wd">{dayLabel(d)}</span><span className="aa-jdaybtn__num">{dayNum(d)}</span>{state==='paid'&&<Check size={11}/>}{state==='pending'&&<Clock size={11}/>}</button>)})}</div>
                <div className="aa-jornadas__legend"><span><i className="aa-dot aa-dot--task"/> sin marcar</span><span><i className="aa-dot aa-dot--brass"/> asistió, sin pagar</span><span><i className="aa-dot aa-dot--money"/> pagado</span></div>
                <div className="aa-jornadas__count">Toca un día: asistió → pagado → vacío</div>
              </div>
              {pendientes>0&&<div className="aa-pendingbar"><span><AlertTriangle size={13}/> Liquidar {pendientes} {pendientes===1?'día':'días'}</span><button className="aa-addsmall aa-addsmall--brass" onClick={()=>onMarkAllPaid(e.id)}>Marcar todo pagado</button></div>}
              <button className="aa-addsmall" onClick={()=>setShowPay(e.id)}><Plus size={13}/> Registrar pago</button>
              {misPagos.length===0?<div className="aa-empty aa-empty--tight">Sin pagos registrados.</div>:<div className="aa-paylist">{misPagos.slice(0,8).map(p=>(<div key={p.id} className="aa-payrow"><span className="aa-payrow__date">{p.fecha}</span><span className="aa-payrow__concepto">{p.concepto||'Pago'}</span><span className="aa-payrow__importe">{fmt(p.importe)} €</span></div>))}</div>}
              <DeleteButton onConfirm={()=>onDeleteEmpleado(e.id)} label="empleado"/>
            </div>}
            {showPay===e.id&&<div className="aa-overlay" onClick={()=>setShowPay(null)}><div className="aa-sheet" onClick={ev=>ev.stopPropagation()}><div className="aa-sheet__handle"/><div className="aa-sheet__title">Pago a {e.nombre}</div><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={payForm.fecha||todayISO()} onChange={ev=>setPayForm({...payForm,fecha:ev.target.value})}/><label className="aa-label">Importe (€)</label><input type="number" className="aa-input" value={payForm.importe||''} onChange={ev=>setPayForm({...payForm,importe:ev.target.value})}/><label className="aa-label">Concepto</label><input className="aa-input" value={payForm.concepto||''} onChange={ev=>setPayForm({...payForm,concepto:ev.target.value})} placeholder="Semana del…"/><button className="aa-submit aa-submit--brass" onClick={()=>submitPago(e.id)}>Guardar pago</button><button className="aa-sheet__close" onClick={()=>setShowPay(null)}><X size={16}/> Cerrar</button></div></div>}
          </div>
        )
      })}</div>
      {showForm&&<div className="aa-overlay" onClick={()=>setShowForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}><div className="aa-sheet__handle"/><div className="aa-sheet__title">Nuevo empleado</div><label className="aa-label">Nombre</label><input className="aa-input" value={form.nombre||''} onChange={e=>setForm({...form,nombre:e.target.value})}/><label className="aa-label">Teléfono (WhatsApp)</label><input className="aa-input" value={form.telefono||''} onChange={e=>setForm({...form,telefono:e.target.value})} placeholder="600 000 000"/><label className="aa-label">Tipo de pago</label><select className="aa-input" value={form.tipoPago} onChange={e=>setForm({...form,tipoPago:e.target.value})}><option value="hora">Por hora</option><option value="dia">Por día</option><option value="fijo">Fijo mensual</option></select><label className="aa-label">Tarifa (€)</label><input type="number" className="aa-input" value={form.tarifa||''} onChange={e=>setForm({...form,tarifa:e.target.value})}/><button className="aa-submit aa-submit--brass" onClick={submitEmpleado}>Guardar empleado</button><button className="aa-sheet__close" onClick={()=>setShowForm(false)}><X size={16}/> Cerrar</button></div></div>}
    </div>
  )
}

export default function Panel() {
  const [authed,setAuthed]=useState(()=>sessionStorage.getItem(SESSION_KEY)==='1')
  if(!authed) return <LoginGate onAuth={()=>setAuthed(true)}/>
  return <PanelInner/>
}

function PanelInner() {
  const [loaded,setLoaded]=useState(false)
  const [view,setView]=useState('hoy')
  const [selectedDate,setSelectedDate]=useState(todayISO())
  const [addOpen,setAddOpen]=useState(false)
  const [clientes,setClientes]=useState<Cliente[]>([])
  const [visitas,setVisitas]=useState<Visita[]>([])
  const [cobros,setCobros]=useState<Cobro[]>([])
  const [tareas,setTareas]=useState<Tarea[]>([])
  const [empleados,setEmpleados]=useState<Empleado[]>([])
  const [pagos,setPagos]=useState<Pago[]>([])
  const [jornadas,setJornadas]=useState<Jornada[]>([])
  const [obras,setObras]=useState<Obra[]>([])
  const [obraitems,setObraitems]=useState<ObraItem[]>([])
  const [asignaciones,setAsignaciones]=useState<Asignacion[]>([])
  const [leads,setLeads]=useState<Lead[]>([])
  const [presupuestos,setPresupuestos]=useState<Presupuesto[]>([])
  const [presupuestolineas,setPresupuestolineas]=useState<PresupuestoLinea[]>([])

  useEffect(()=>{
    const d=loadAll()
    setClientes(d.clientes as Cliente[]); setVisitas(d.visitas as Visita[]); setCobros(d.cobros as Cobro[])
    setTareas(d.tareas as Tarea[]); setEmpleados(d.empleados as Empleado[]); setPagos(d.pagos as Pago[])
    setJornadas(d.jornadas as Jornada[]); setObras(d.obras as Obra[]); setObraitems(d.obraitems as ObraItem[])
    setAsignaciones(d.asignaciones as Asignacion[]); setLeads(d.leads as Lead[])
    setPresupuestos(d.presupuestos as Presupuesto[]); setPresupuestolineas(d.presupuestolineas as PresupuestoLinea[])
    setLoaded(true)
  },[])

  const findOrCreateCliente=(nombre:string,list:Cliente[])=>{
    const match=list.find(c=>c.nombre.trim().toLowerCase()===nombre.trim().toLowerCase())
    if(match) return{id:match.id,list}
    const nuevo:Cliente={id:uid(),nombre:nombre.trim(),telefono:'',direccion:'',frecuencia:'',notas:''}
    return{id:nuevo.id,list:[...list,nuevo]}
  }

  const handleCreate=(type:string,payload:Record<string,unknown>)=>{
    if(type==='tarea'){const next=[...tareas,{id:uid(),descripcion:String(payload.descripcion),fecha:String(payload.fecha),completada:false}];setTareas(next);persist('tareas',next);return}
    const{id:clienteId,list:nc}=findOrCreateCliente(String(payload.clienteNombre),clientes)
    if(nc!==clientes){setClientes(nc);persist('clientes',nc)}
    if(type==='visita'){const next=[...visitas,{id:uid(),clienteId,fecha:String(payload.fecha),hora:String(payload.hora||''),tipo:String(payload.tipo||''),direccion:String(payload.direccion||''),notas:String(payload.notas||''),estado:'pendiente'}];setVisitas(next);persist('visitas',next)}
    else if(type==='cobro'){const next=[...cobros,{id:uid(),clienteId,fecha:String(payload.fecha),hora:String(payload.hora||''),importe:Number(payload.importe),metodo:String(payload.metodo||''),estado:'pendiente'}];setCobros(next);persist('cobros',next)}
  }
  const toggleEstado=(type:string,id:string)=>{if(type==='visita'){const next=visitas.map(v=>v.id===id?{...v,estado:v.estado==='realizado'?'pendiente':'realizado'}:v);setVisitas(next);persist('visitas',next)}else{const next=cobros.map(c=>c.id===id?{...c,estado:c.estado==='cobrado'?'pendiente':'cobrado'}:c);setCobros(next);persist('cobros',next)}}
  const toggleTarea=(id:string)=>{const next=tareas.map(t=>t.id===id?{...t,completada:!t.completada}:t);setTareas(next);persist('tareas',next)}
  const deleteItem=(col:string,id:string)=>{
    const map:Record<string,[unknown[],React.Dispatch<React.SetStateAction<unknown[]>>]>={visitas:[visitas as unknown[],setVisitas as never],cobros:[cobros as unknown[],setCobros as never],tareas:[tareas as unknown[],setTareas as never],clientes:[clientes as unknown[],setClientes as never],empleados:[empleados as unknown[],setEmpleados as never],obraitems:[obraitems as unknown[],setObraitems as never],asignaciones:[asignaciones as unknown[],setAsignaciones as never],leads:[leads as unknown[],setLeads as never],presupuestolineas:[presupuestolineas as unknown[],setPresupuestolineas as never]}
    if(!map[col]) return
    const[arr,setter]=map[col]; const next=(arr as{id:string}[]).filter(x=>x.id!==id); setter(next as never); persist(col,next)
  }
  const addLead=(data:Partial<Lead>)=>{const next=[...leads,{id:uid(),nombre:'',telefono:'',gremio:'',mensaje:'',estado:'nuevo' as const,fecha:todayISO(),...data} as Lead];setLeads(next);persist('leads',next)}
  const setLeadEstado=(id:string,estado:string)=>{const next=leads.map(l=>l.id===id?{...l,estado:estado as Lead['estado']}:l);setLeads(next);persist('leads',next)}
  const convertLead=(lead:Lead)=>{const nc=[...clientes,{id:uid(),nombre:lead.nombre,telefono:lead.telefono||'',direccion:'',frecuencia:'',notas:lead.gremio?`Pedía: ${lead.gremio}`:''}];setClientes(nc);persist('clientes',nc);const nl=leads.map(l=>l.id===lead.id?{...l,estado:'convertido' as const}:l);setLeads(nl);persist('leads',nl)}
  const addPresupuestoWithLineas=(data:Record<string,unknown>,localLineas:PresupuestoLinea[])=>{
    const{id:clienteId,list:nc}=findOrCreateCliente(String(data.clienteNombre||''),clientes)
    if(nc!==clientes){setClientes(nc);persist('clientes',nc)}
    const newId=uid()
    const np:Presupuesto={id:newId,clienteId,nombre:String(data.nombre||''),estado:String(data.estado||'Borrador'),fecha:String(data.fecha||todayISO()),notas:String(data.notas||''),iva:Boolean(data.iva)}
    const nextP=[...presupuestos,np];setPresupuestos(nextP);persist('presupuestos',nextP)
    if(localLineas.length>0){const nextL=[...presupuestolineas,...localLineas.map(l=>({...l,id:uid(),presupuestoId:newId}))];setPresupuestolineas(nextL);persist('presupuestolineas',nextL)}
  }
  const updatePresupuesto=(id:string,data:Partial<Presupuesto>)=>{const next=presupuestos.map(p=>p.id===id?{...p,...data}:p);setPresupuestos(next);persist('presupuestos',next)}
  const addLinea=(presupuestoId:string,data:Omit<PresupuestoLinea,'id'|'presupuestoId'>)=>{const next=[...presupuestolineas,{id:uid(),presupuestoId,...data}];setPresupuestolineas(next);persist('presupuestolineas',next)}
  const convertirObra=(p:Presupuesto)=>{const c=clientes.find(x=>x.id===p.clienteId);addObra({nombre:p.nombre,cliente:c?.nombre||'',direccion:c?.direccion||'',estado:'En curso',fechaInicio:todayISO(),notas:`Generada desde presupuesto "${p.nombre}"`})}
  const addObra=(data:Partial<Obra>)=>{const next=[...obras,{id:uid(),cliente:'',direccion:'',notas:'',...data} as Obra];setObras(next);persist('obras',next)}
  const updateObra=(id:string,data:Partial<Obra>)=>{const next=obras.map(o=>o.id===id?{...o,...data}:o);setObras(next);persist('obras',next)}
  const deleteObra=(id:string)=>{const no=obras.filter(o=>o.id!==id);setObras(no);persist('obras',no);const ni=obraitems.filter(i=>i.obraId!==id);setObraitems(ni);persist('obraitems',ni);const na=asignaciones.filter(a=>a.obraId!==id);setAsignaciones(na);persist('asignaciones',na)}
  const addObraItem=(obraId:string,data:Partial<ObraItem>)=>{const next=[...obraitems,{id:uid(),obraId,completado:false,...data} as ObraItem];setObraitems(next);persist('obraitems',next)}
  const toggleObraItem=(id:string)=>{const next=obraitems.map(i=>i.id===id?{...i,completado:!i.completado}:i);setObraitems(next);persist('obraitems',next)}
  const addAsignacion=(obraId:string,data:Partial<Asignacion>)=>{const next=[...asignaciones,{id:uid(),obraId,...data} as Asignacion];setAsignaciones(next);persist('asignaciones',next)}
  const addCliente=(data:Partial<Cliente>)=>{const next=[...clientes,{id:uid(),telefono:'',direccion:'',frecuencia:'',notas:'',...data} as Cliente];setClientes(next);persist('clientes',next)}
  const updateCliente=(id:string,data:Partial<Cliente>)=>{const next=clientes.map(c=>c.id===id?{...c,...data}:c);setClientes(next);persist('clientes',next)}
  const addEmpleado=(data:Record<string,string>)=>{const next=[...empleados,{id:uid(),nombre:data.nombre||'',telefono:data.telefono||'',tipoPago:(data.tipoPago||'hora') as Empleado['tipoPago'],tarifa:Number(data.tarifa)||0}];setEmpleados(next);persist('empleados',next)}
  const cycleJornada=(empleadoId:string,fecha:string)=>{const ex=jornadas.find(j=>j.empleadoId===empleadoId&&j.fecha===fecha);let next:Jornada[];if(!ex)next=[...jornadas,{id:uid(),empleadoId,fecha,pagado:false}];else if(!ex.pagado)next=jornadas.map(j=>j.id===ex.id?{...j,pagado:true}:j);else next=jornadas.filter(j=>j.id!==ex.id);setJornadas(next);persist('jornadas',next)}
  const markAllPaid=(empleadoId:string)=>{const next=jornadas.map(j=>j.empleadoId===empleadoId&&!j.pagado?{...j,pagado:true}:j);setJornadas(next);persist('jornadas',next)}
  const addPago=(empleadoId:string,data:Omit<Pago,'id'|'empleadoId'>)=>{const next=[...pagos,{id:uid(),empleadoId,...data}];setPagos(next);persist('pagos',next)}

  const dataBag={clientes,visitas,cobros,tareas}
  const week=useMemo(()=>weekDaysOf(selectedDate),[selectedDate])
  const resumen=useMemo(()=>({
    leadsNuevos:leads.filter(l=>l.estado==='nuevo').length,
    empleadosSinPagar:empleados.filter(emp=>jornadas.some(j=>j.empleadoId===emp.id&&!j.pagado)).length,
    obrasConPendientes:obras.filter(o=>o.estado==='En curso'&&obraitems.some(i=>i.obraId===o.id&&!i.completado)).length,
  }),[leads,empleados,jornadas,obras,obraitems])

  if(!loaded) return <div className="aa-root aa-root--loading"><style>{CSS}</style><Sun className="aa-spin" size={26}/></div>

  return (
    <div className="aa-root">
      <style>{CSS}</style>
      <header className="aa-header">
        <div className="aa-eyebrow">LIBRO DE OBRA</div>
        {view==='hoy'&&<div className="aa-datenav"><button className="aa-iconbtn" onClick={()=>setSelectedDate(addDays(selectedDate,-1))}><ChevronLeft size={18}/></button><div className="aa-datenav__label">{longLabel(selectedDate)}</div><button className="aa-iconbtn" onClick={()=>setSelectedDate(addDays(selectedDate,1))}><ChevronRight size={18}/></button></div>}
        {view==='hoy'&&selectedDate!==todayISO()&&<button className="aa-todaybtn" onClick={()=>setSelectedDate(todayISO())}>Ir a hoy</button>}
        {view==='semana'&&<div className="aa-datenav__label aa-datenav__label--solo">Semana</div>}
        {view==='obras'&&<div className="aa-datenav__label aa-datenav__label--solo">Obras</div>}
        {view==='clientes'&&<div className="aa-datenav__label aa-datenav__label--solo">Clientes</div>}
        {view==='equipo'&&<div className="aa-datenav__label aa-datenav__label--solo">Equipo</div>}
        {view==='presupuestos'&&<div className="aa-datenav__label aa-datenav__label--solo">Presupuestos</div>}
      </header>
      <main className="aa-main">
        {view==='hoy'&&(resumen.leadsNuevos>0||resumen.empleadosSinPagar>0||resumen.obrasConPendientes>0)&&(
          <div className="aa-resumen">
            {resumen.leadsNuevos>0&&<button className="aa-resumen__chip" onClick={()=>setView('clientes')}><Megaphone size={13}/> {resumen.leadsNuevos} lead{resumen.leadsNuevos===1?'':'s'} sin contactar</button>}
            {resumen.empleadosSinPagar>0&&<button className="aa-resumen__chip" onClick={()=>setView('equipo')}><Wallet size={13}/> {resumen.empleadosSinPagar} empleado{resumen.empleadosSinPagar===1?'':'s'} sin pagar</button>}
            {resumen.obrasConPendientes>0&&<button className="aa-resumen__chip" onClick={()=>setView('obras')}><HardHat size={13}/> {resumen.obrasConPendientes} obra{resumen.obrasConPendientes===1?'':'s'} con pendientes</button>}
          </div>
        )}
        {view==='hoy'&&<DayAgenda date={selectedDate} data={dataBag} onToggleEstado={toggleEstado} onToggleTarea={toggleTarea} onDelete={deleteItem}/>}
        {view==='semana'&&<><div className="aa-weekstrip">{week.map(d=>{const vC=visitas.filter(v=>v.fecha===d).length;const cC=cobros.filter(c=>c.fecha===d).length;const tC=tareas.filter(t=>t.fecha===d).length;const isSel=d===selectedDate;const isToday=d===todayISO();return(<button key={d} className={`aa-daypill${isSel?' is-selected':''}${isToday?' is-today':''}`} onClick={()=>setSelectedDate(d)}><span className="aa-daypill__wd">{dayLabel(d)}</span><span className="aa-daypill__num">{dayNum(d)}</span><span className="aa-daypill__dots">{vC>0&&<i className="aa-dot aa-dot--water"/>}{cC>0&&<i className="aa-dot aa-dot--money"/>}{tC>0&&<i className="aa-dot aa-dot--task"/>}</span></button>)})}</div><div className="aa-weekday-title">{longLabel(selectedDate)}</div><DayAgenda date={selectedDate} data={dataBag} onToggleEstado={toggleEstado} onToggleTarea={toggleTarea} onDelete={deleteItem}/></>}
        {view==='obras'&&<ObrasView obras={obras} obraitems={obraitems} asignaciones={asignaciones} empleados={empleados} onAddObra={addObra} onUpdateObra={updateObra} onDeleteObra={deleteObra} onAddItem={addObraItem} onToggleItem={toggleObraItem} onDeleteItem={id=>deleteItem('obraitems',id)} onAddAsignacion={addAsignacion} onDeleteAsignacion={id=>deleteItem('asignaciones',id)}/>}
        {view==='presupuestos'&&<PresupuestosView presupuestos={presupuestos} presupuestolineas={presupuestolineas} clientes={clientes} onAddPresupuestoWithLineas={addPresupuestoWithLineas} onUpdatePresupuesto={updatePresupuesto} onAddLinea={addLinea} onDeleteLinea={id=>deleteItem('presupuestolineas',id)} onConvertirObra={convertirObra}/>}
        {view==='clientes'&&<ClientesView clientes={clientes} visitas={visitas} leads={leads} onAddCliente={addCliente} onDeleteCliente={id=>deleteItem('clientes',id)} onUpdateCliente={updateCliente} onAddLead={addLead} onSetLeadEstado={setLeadEstado} onDeleteLead={id=>deleteItem('leads',id)} onConvertLead={convertLead}/>}
        {view==='equipo'&&<EmpleadosView empleados={empleados} pagos={pagos} jornadas={jornadas} obras={obras} obraitems={obraitems} asignaciones={asignaciones} onAddEmpleado={addEmpleado} onDeleteEmpleado={id=>deleteItem('empleados',id)} onAddPago={addPago} onCycleJornada={cycleJornada} onMarkAllPaid={markAllPaid}/>}
      </main>
      <button className="aa-fab" onClick={()=>setAddOpen(true)} aria-label="Añadir"><Plus size={24}/></button>
      <nav className="aa-tabbar">
        <button className={`aa-tab${view==='hoy'?' is-active':''}`} onClick={()=>setView('hoy')}><Clock size={18}/><span>Hoy</span></button>
        <button className={`aa-tab${view==='semana'?' is-active':''}`} onClick={()=>setView('semana')}><CalendarDays size={18}/><span>Semana</span></button>
        <button className={`aa-tab${view==='obras'?' is-active':''}`} onClick={()=>setView('obras')}><HardHat size={18}/><span>Obras</span></button>
        <button className={`aa-tab${view==='presupuestos'?' is-active':''}`} onClick={()=>setView('presupuestos')}><Receipt size={18}/><span>Presup.</span></button>
        <button className={`aa-tab${view==='clientes'?' is-active':''}`} onClick={()=>setView('clientes')}><Users size={18}/><span>Clientes</span></button>
        <button className={`aa-tab${view==='equipo'?' is-active':''}`} onClick={()=>setView('equipo')}><Wallet size={18}/><span>Equipo</span></button>
      </nav>
      <AddSheet open={addOpen} onClose={()=>setAddOpen(false)} clientes={clientes} defaultDate={selectedDate} onCreate={handleCreate}/>
    </div>
  )
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
.aa-root{--bg:#1B1F23;--surface:#242A33;--surface-2:#2D343F;--border:#3A4250;--text:#F2EEE4;--text-dim:#9AA3AF;--brass:#C9A227;--brass-dim:rgba(201,162,39,0.16);--water:#3FA9D6;--water-dim:rgba(63,169,214,0.16);--money:#5FBE7E;--money-dim:rgba(95,190,126,0.16);--task:#AAB3BF;--task-dim:rgba(170,179,191,0.14);--danger:#E2625A;--danger-dim:rgba(226,98,90,0.16);--radius:9px;position:relative;max-width:460px;margin:0 auto;height:100vh;min-height:560px;background:var(--bg);color:var(--text);font-family:'IBM Plex Sans',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;}
.aa-root--loading{align-items:center;justify-content:center;}
.aa-spin{color:var(--brass);animation:aa-spin 1.4s linear infinite;}
@keyframes aa-spin{to{transform:rotate(360deg);}}
*{box-sizing:border-box;}
.aa-header{padding:18px 18px 12px;border-bottom:1px solid var(--border);flex-shrink:0;}
.aa-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:var(--brass);margin-bottom:8px;}
.aa-datenav{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.aa-datenav__label{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:600;text-align:center;flex:1;}
.aa-datenav__label--solo{text-align:left;font-size:19px;}
.aa-todaybtn{margin-top:8px;background:var(--brass-dim);color:var(--brass);border:1px solid var(--brass);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer;}
.aa-main{flex:1;overflow-y:auto;padding:14px 14px 90px;}
.aa-empty{color:var(--text-dim);font-size:13.5px;text-align:center;padding:40px 20px;line-height:1.5;}
.aa-empty--tight{padding:10px 4px;text-align:left;}
.aa-stamp{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:12.5px;border:1.5px dashed var(--water);color:var(--water);border-radius:6px;padding:5px 6px;min-width:50px;text-align:center;transform:rotate(-1.5deg);flex-shrink:0;background:var(--water-dim);}
.aa-stamp--money{border-color:var(--money);color:var(--money);background:var(--money-dim);}
.aa-stamp--brass{border-color:var(--brass);color:var(--brass);background:var(--brass-dim);}
.aa-daylist{display:flex;flex-direction:column;gap:10px;}
.aa-task-row-group{display:flex;flex-direction:column;gap:6px;margin-bottom:4px;}
.aa-taskrow{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--task);border-radius:var(--radius);padding:9px 10px;}
.aa-taskrow.is-done{opacity:0.5;}.aa-taskrow.is-done .aa-taskrow__text{text-decoration:line-through;}
.aa-taskrow__text{flex:1;font-size:13.5px;}
.aa-checkbox{width:20px;height:20px;border-radius:5px;border:1.5px solid var(--task);background:transparent;color:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
.aa-taskrow.is-done .aa-checkbox{background:var(--task);color:var(--bg);}
.aa-ticket{display:flex;gap:10px;align-items:flex-start;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--water);border-radius:var(--radius);padding:10px;}
.aa-ticket--money{border-left-color:var(--money);}.aa-ticket.is-done{opacity:0.55;}
.aa-ticket__body{flex:1;min-width:0;}.aa-ticket__top{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.aa-ticket__icon{color:var(--text-dim);display:flex;}
.aa-ticket__client{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14.5px;}
.aa-ticket__meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.aa-ticket__sub{font-size:12px;color:var(--text-dim);display:flex;align-items:center;gap:3px;}
.aa-ticket__notas{font-size:12px;color:var(--text-dim);width:100%;}
.aa-ticket__actions{display:flex;flex-direction:column;gap:6px;}
.aa-tag{font-size:11px;font-weight:600;background:var(--water-dim);color:var(--water);border-radius:5px;padding:2px 7px;}
.aa-tag--money{background:var(--money-dim);color:var(--money);}
.aa-tag--gremio{background:var(--surface-2);color:var(--text-dim);margin-right:4px;}
.aa-tag--estado-encurso{background:var(--water-dim);color:var(--water);}
.aa-tag--estado-pausada{background:var(--brass-dim);color:var(--brass);}
.aa-tag--estado-terminada{background:var(--money-dim);color:var(--money);}
.aa-tag--estado-borrador{background:var(--task-dim);color:var(--task);}
.aa-tag--estado-enviado{background:var(--water-dim);color:var(--water);}
.aa-tag--estado-aceptado{background:var(--money-dim);color:var(--money);}
.aa-tag--estado-rechazado{background:var(--danger-dim);color:var(--danger);}
.aa-iconbtn{width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-dim);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;}
.aa-iconbtn--ok{color:var(--money);}
.aa-iconbtn--danger{background:var(--danger-dim);color:var(--danger);border-color:var(--danger);}
.aa-weekstrip{display:flex;gap:5px;margin-bottom:14px;}
.aa-daypill{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:8px 2px;cursor:pointer;color:var(--text-dim);}
.aa-daypill.is-today{border-color:var(--brass);}
.aa-daypill.is-selected{background:var(--brass-dim);border-color:var(--brass);color:var(--text);}
.aa-daypill__wd{font-size:10px;font-weight:600;letter-spacing:0.04em;}
.aa-daypill__num{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;}
.aa-daypill__dots{display:flex;gap:2px;height:5px;}
.aa-dot{width:5px;height:5px;border-radius:50%;display:inline-block;}
.aa-dot--water{background:var(--water);}.aa-dot--money{background:var(--money);}.aa-dot--task{background:var(--task);}.aa-dot--brass{background:var(--brass);}
.aa-weekday-title{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;margin-bottom:10px;color:var(--text-dim);}
.aa-view{display:flex;flex-direction:column;}
.aa-subtabs{display:flex;gap:6px;margin-bottom:12px;}
.aa-subtab{flex:1;background:var(--surface);border:1px solid var(--border);color:var(--text-dim);border-radius:8px;padding:8px 0;font-size:12.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;}
.aa-subtab.is-active{background:var(--brass-dim);border-color:var(--brass);color:var(--brass);}
.aa-subtab__badge{background:var(--brass);color:var(--bg);border-radius:9px;font-size:10px;padding:1px 6px;}
.aa-leadactions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.aa-resumen{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
.aa-resumen__chip{display:flex;align-items:center;gap:5px;background:var(--brass-dim);border:1px solid var(--brass);color:var(--brass);border-radius:7px;padding:6px 9px;font-size:11.5px;font-weight:600;cursor:pointer;}
.aa-viewheader{display:flex;align-items:center;justify-content:space-between;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:17px;margin-bottom:12px;}
.aa-addsmall{display:flex;align-items:center;gap:4px;background:var(--brass-dim);color:var(--brass);border:1px solid var(--brass);border-radius:7px;padding:5px 9px;font-size:12.5px;font-weight:600;cursor:pointer;}
.aa-addsmall--brass{background:var(--brass);color:var(--bg);border-color:var(--brass);flex-shrink:0;}
.aa-clientlist{display:flex;flex-direction:column;gap:8px;}
.aa-clientcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:11px;}
.aa-clientcard__top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.aa-clientcard__name{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14.5px;}
.aa-clientcard__row{display:flex;gap:10px;align-items:center;margin-top:5px;font-size:12px;color:var(--text-dim);}
.aa-clientcard__row span{display:flex;align-items:center;gap:3px;}
.aa-clientcard__sub{font-size:12px;color:var(--text-dim);margin-top:5px;}
.aa-obrablock{margin-top:4px;}
.aa-obrablock__title{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;color:var(--text-dim);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em;}
.aa-inlineform{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
.aa-flag{display:flex;align-items:center;gap:3px;font-size:11px;color:var(--danger);font-weight:600;}
.aa-empexpand{margin-top:10px;padding-top:10px;border-top:1px dashed var(--border);display:flex;flex-direction:column;gap:8px;}
.aa-jornadas{background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:9px;}
.aa-jornadas__nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.aa-jornadas__label{font-size:11.5px;color:var(--text-dim);font-weight:600;}
.aa-jornadas__days{display:flex;gap:4px;}
.aa-jdaybtn{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:6px 2px;cursor:pointer;color:var(--text-dim);}
.aa-jdaybtn.is-today{border-color:var(--brass);}
.aa-jdaybtn.is-pending{background:var(--brass-dim);border-color:var(--brass);color:var(--brass);}
.aa-jdaybtn.is-paid{background:var(--money-dim);border-color:var(--money);color:var(--money);}
.aa-jdaybtn__wd{font-size:9.5px;font-weight:600;}
.aa-jdaybtn__num{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;}
.aa-jornadas__count{font-size:11px;color:var(--text-dim);margin-top:6px;text-align:center;}
.aa-jornadas__legend{display:flex;flex-wrap:wrap;gap:9px;margin-top:8px;font-size:10.5px;color:var(--text-dim);}
.aa-jornadas__legend span{display:flex;align-items:center;gap:4px;}
.aa-pendingbar{display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--brass-dim);border:1px solid var(--brass);color:var(--brass);border-radius:8px;padding:8px 10px;font-size:12px;font-weight:600;}
.aa-globalcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;}
.aa-globalcard__row{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.aa-globalcard__label{font-size:12px;color:var(--text-dim);font-weight:600;}
.aa-globalcard__value{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13.5px;text-align:right;}
.aa-globalcard__value--brass{color:var(--brass);}.aa-globalcard__value--money{color:var(--money);}
.aa-globalcard__divider{height:1px;background:var(--border);margin:10px 0;}
.aa-globalcard__rangerow{display:flex;align-items:center;gap:8px;}
.aa-globalcard__y{font-size:11.5px;color:var(--text-dim);}
.aa-input--sm{padding:6px 7px;font-size:12.5px;flex:1;}
.aa-paylist{display:flex;flex-direction:column;gap:4px;}
.aa-payrow{display:flex;gap:8px;font-size:12px;color:var(--text-dim);align-items:center;}
.aa-payrow__date{font-family:'IBM Plex Mono',monospace;}
.aa-payrow__concepto{flex:1;}
.aa-payrow__importe{color:var(--brass);font-weight:600;}
.aa-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:flex-end;z-index:30;}
.aa-sheet{width:100%;max-height:86%;overflow-y:auto;background:var(--surface);border-top:1px solid var(--border);border-radius:16px 16px 0 0;padding:10px 18px 24px;display:flex;flex-direction:column;}
.aa-sheet__handle{width:36px;height:4px;border-radius:3px;background:var(--border);margin:4px auto 14px;}
.aa-sheet__title{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px;margin-bottom:12px;}
.aa-choicegrid{display:flex;gap:8px;}
.aa-choice{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 6px;border-radius:11px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);cursor:pointer;font-size:12.5px;font-weight:600;}
.aa-choice--water{color:var(--water);border-color:var(--water);background:var(--water-dim);}
.aa-choice--money{color:var(--money);border-color:var(--money);background:var(--money-dim);}
.aa-choice--task{color:var(--task);border-color:var(--task);background:var(--task-dim);}
.aa-label{font-size:11.5px;color:var(--text-dim);margin:10px 0 4px;display:block;font-weight:600;}
.aa-input{width:100%;background:var(--surface-2);border:1px solid var(--border);border-radius:7px;padding:9px 10px;color:var(--text);font-size:14px;font-family:'IBM Plex Sans',sans-serif;}
.aa-textarea{resize:vertical;min-height:56px;}
.aa-row2{display:flex;gap:10px;}
.aa-row2>div{flex:1;}
.aa-submit{margin-top:16px;padding:12px;border-radius:9px;border:none;font-weight:700;font-size:14.5px;cursor:pointer;color:var(--bg);background:var(--brass);width:100%;}
.aa-submit--water{background:var(--water);}.aa-submit--money{background:var(--money);}.aa-submit--task{background:var(--task);}.aa-submit--brass{background:var(--brass);}
.aa-submit--danger{background:transparent;color:var(--danger);border:1px solid var(--danger);margin-top:8px;}
.aa-sheet__close{margin-top:14px;background:none;border:none;color:var(--text-dim);display:flex;align-items:center;justify-content:center;gap:5px;font-size:13px;cursor:pointer;padding:6px;}
.aa-fab{position:absolute;right:16px;bottom:78px;z-index:20;width:54px;height:54px;border-radius:50%;background:var(--brass);color:var(--bg);border:none;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.4);cursor:pointer;}
.aa-tabbar{display:flex;border-top:1px solid var(--border);background:var(--surface);flex-shrink:0;overflow-x:auto;}
.aa-tab{flex:1 0 auto;min-width:60px;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 2px 9px;background:none;border:none;color:var(--text-dim);font-size:9.5px;font-weight:600;cursor:pointer;white-space:nowrap;}
.aa-tab.is-active{color:var(--brass);}
.aa-editor-view{display:flex;flex-direction:column;height:100%;background:var(--bg);}
.aa-editor-header{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--border);flex-shrink:0;background:var(--surface);}
.aa-editor-title{flex:1;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.aa-editor-body{flex:1;overflow-y:auto;padding:12px 14px 24px;display:flex;flex-direction:column;gap:10px;}
.aa-editor-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:13px;}
.aa-gremio-block{margin-bottom:10px;}
.aa-gremio-block__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--border);}
.aa-gremio-total{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:13px;color:var(--brass);}
.aa-linea-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px dashed var(--border);}
.aa-linea-row:last-child{border-bottom:none;}
.aa-linea-main{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.aa-linea-concepto{font-size:13.5px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.aa-linea-qty{font-size:11.5px;color:var(--text-dim);}
.aa-linea-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.aa-linea-total{font-family:'IBM Plex Mono',monospace;font-size:12.5px;font-weight:600;color:var(--money);}
.aa-addlinea-form{display:flex;flex-direction:column;gap:6px;padding-top:12px;border-top:1px dashed var(--border);margin-top:8px;}
.aa-summary-card{background:var(--surface-2);}
.aa-summary-rows{display:flex;flex-direction:column;gap:6px;margin-bottom:4px;}
.aa-summary-row{display:flex;align-items:center;justify-content:space-between;font-size:13px;padding:2px 0;}
.aa-summary-gremio{color:var(--text-dim);}
.aa-summary-divider{height:1px;background:var(--border);margin:8px 0;}
.aa-summary-iva-row{cursor:pointer;color:var(--text-dim);display:flex;align-items:center;justify-content:space-between;font-size:13px;padding:4px 0;}
.aa-summary-iva-label{display:flex;align-items:center;}
.aa-summary-total-row{margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700;color:var(--brass);}
@media(prefers-reduced-motion:reduce){.aa-spin{animation:none;}}
`
