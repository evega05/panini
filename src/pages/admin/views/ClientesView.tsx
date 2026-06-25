import { useState, useMemo } from 'react'
import { Plus, Phone, X, AlertTriangle, UserCheck, Pencil, Banknote } from 'lucide-react'
import type { Cliente, Visita, Cobro, Lead } from '../types'
import { GREMIOS_SUGERIDOS } from '../types'
import { todayISO, daysAgo, fmt } from '../utils'
import { DeleteButton, EmptyState } from './shared'

export function ClientesView({clientes,visitas,cobros,leads,onAddCliente,onDeleteCliente,onUpdateCliente,onAddCobro,onAddLead,onSetLeadEstado,onDeleteLead,onConvertLead}:{clientes:Cliente[];visitas:Visita[];cobros:Cobro[];leads:Lead[];onAddCliente:(d:Partial<Cliente>)=>void;onDeleteCliente:(id:string)=>void;onUpdateCliente:(id:string,d:Partial<Cliente>)=>void;onAddCobro:(clienteId:string,d:Omit<Cobro,'id'|'clienteId'>)=>void;onAddLead:(d:Partial<Lead>)=>void;onSetLeadEstado:(id:string,e:string)=>void;onDeleteLead:(id:string)=>void;onConvertLead:(l:Lead)=>void}) {
  const [subView,setSubView] = useState('clientes')
  const [openId,setOpenId] = useState<string|null>(null)
  const [showForm,setShowForm] = useState(false)
  const [editing,setEditing] = useState<string|null>(null)
  const [form,setForm] = useState<Record<string,string>>({})
  const [cobroForm,setCobroForm] = useState<Record<string,string>>({})
  const [showLeadForm,setShowLeadForm] = useState(false)
  const [leadForm,setLeadForm] = useState<Record<string,string>>({})
  const openEdit=(c:Cliente)=>{setForm(c as unknown as Record<string,string>);setEditing(c.id);setShowForm(true)}
  const submit=()=>{if(!form.nombre?.trim())return;if(editing)onUpdateCliente(editing,form);else onAddCliente(form);setShowForm(false)}
  const submitLead=()=>{if(!leadForm.nombre?.trim())return;onAddLead(leadForm);setLeadForm({});setShowLeadForm(false)}
  const submitCobro=(clienteId:string)=>{if(!cobroForm.importe)return;onAddCobro(clienteId,{fecha:cobroForm.fecha||todayISO(),hora:cobroForm.hora||'',importe:Number(cobroForm.importe),metodo:cobroForm.metodo||'Efectivo',estado:'cobrado'});setCobroForm({})}
  const stats=useMemo(()=>clientes.map(c=>{
    const vs=visitas.filter(v=>v.clienteId===c.id).sort((a,b)=>b.fecha.localeCompare(a.fecha))
    const cs=cobros.filter(co=>co.clienteId===c.id).sort((a,b)=>b.fecha.localeCompare(a.fecha))
    const last=vs[0]?.fecha
    const fn=Number(c.frecuencia);let overdue=false
    if(last&&fn>0){const exp=Math.round(7/fn);overdue=daysAgo(last)>exp*1.6}
    const total=cs.reduce((s,co)=>s+Number(co.importe),0)
    return{...c,lastVisit:last,overdue,cobrosCliente:cs,total}
  }),[clientes,visitas,cobros])
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
      {subView==='clientes'&&<>
        <div className="aa-viewheader"><span>Clientes</span><button className="aa-addsmall" onClick={()=>{setForm({});setEditing(null);setShowForm(true)}}><Plus size={14}/> Cliente</button></div>
        {stats.length===0&&<EmptyState text="Sin clientes todavía."/>}
        <div className="aa-clientlist">{stats.map(c=>{
          const open=openId===c.id
          return (
            <div key={c.id} className="aa-clientcard">
              <div className="aa-clientcard__top" onClick={()=>setOpenId(open?null:c.id)} style={{cursor:'pointer'}}>
                <span className="aa-clientcard__name">{c.nombre}</span>
                {c.overdue&&<span className="aa-flag"><AlertTriangle size={12}/> atrasado</span>}
              </div>
              <div className="aa-clientcard__row">
                {c.telefono&&<span><Phone size={11}/> {c.telefono}</span>}
                {c.frecuencia&&<span className="aa-tag">{c.frecuencia}x/semana</span>}
              </div>
              <div className="aa-clientcard__sub">
                {c.lastVisit?`Última visita: hace ${daysAgo(c.lastVisit)} días`:'Sin visitas todavía'}
                {c.total>0&&<> · Total cobrado: <strong>{fmt(c.total)} €</strong></>}
              </div>
              {open&&<div className="aa-empexpand">
                <button className="aa-addsmall" onClick={()=>openEdit(c)}><Pencil size={13}/> Editar datos</button>
                <div className="aa-obrablock">
                  <div className="aa-obrablock__title">Cobros</div>
                  {c.cobrosCliente.length===0&&<div className="aa-empty aa-empty--tight">Sin cobros registrados.</div>}
                  <div className="aa-paylist">
                    {c.cobrosCliente.slice(0,10).map(co=>(
                      <div key={co.id} className="aa-payrow">
                        <span className="aa-payrow__date">{co.fecha}</span>
                        <span className="aa-payrow__concepto">{co.metodo}</span>
                        <span className="aa-payrow__importe">{fmt(co.importe)} €</span>
                      </div>
                    ))}
                  </div>
                  <div className="aa-inlineform" style={{marginTop:10}}>
                    <div className="aa-row2">
                      <input type="date" className="aa-input" value={cobroForm.fecha||todayISO()} onChange={e=>setCobroForm({...cobroForm,fecha:e.target.value})}/>
                      <input type="number" className="aa-input" value={cobroForm.importe||''} onChange={e=>setCobroForm({...cobroForm,importe:e.target.value})} placeholder="Importe €"/>
                    </div>
                    <select className="aa-input" value={cobroForm.metodo||'Efectivo'} onChange={e=>setCobroForm({...cobroForm,metodo:e.target.value})}>
                      <option>Efectivo</option><option>Transferencia</option><option>Bizum</option>
                    </select>
                    <button className="aa-addsmall" onClick={()=>submitCobro(c.id)}><Banknote size={13}/> Registrar cobro</button>
                  </div>
                </div>
              </div>}
            </div>
          )
        })}</div>
      </>}
      {subView==='leads'&&<><div className="aa-viewheader"><span>Leads</span><button className="aa-addsmall" onClick={()=>setShowLeadForm(true)}><Plus size={14}/> Lead</button></div>{!leadsActivos.length&&!leadsArchivados.length&&<EmptyState text="Sin solicitudes todavía."/>}<div className="aa-clientlist">{leadsActivos.map(l=>(<div key={l.id} className="aa-clientcard"><div className="aa-clientcard__top"><span className="aa-clientcard__name">{l.nombre}</span><span className={`aa-tag${l.estado==='nuevo'?' aa-tag--estado-encurso':' aa-tag--gremio'}`}>{ELABEL[l.estado]}</span></div><div className="aa-clientcard__row">{l.telefono&&<span><Phone size={11}/> {l.telefono}</span>}{l.gremio&&<span className="aa-tag aa-tag--gremio">{l.gremio}</span>}</div>{l.mensaje&&<div className="aa-clientcard__sub">{l.mensaje}</div>}<div className="aa-leadactions">{l.estado==='nuevo'&&<button className="aa-addsmall" onClick={()=>onSetLeadEstado(l.id,'contactado')}>Marcar contactado</button>}<button className="aa-addsmall aa-addsmall--brass" onClick={()=>onConvertLead(l)}><UserCheck size={13}/> Convertir en cliente</button><button className="aa-addsmall" onClick={()=>onSetLeadEstado(l.id,'descartado')}>Descartar</button><DeleteButton onConfirm={()=>onDeleteLead(l.id)} label="lead"/></div></div>))}{leadsArchivados.length>0&&<><div className="aa-obrablock__title" style={{marginTop:10}}>Archivados</div>{leadsArchivados.map(l=>(<div key={l.id} className="aa-clientcard" style={{opacity:0.6}}><div className="aa-clientcard__top"><span className="aa-clientcard__name">{l.nombre}</span><span className="aa-tag aa-tag--gremio">{ELABEL[l.estado]}</span></div><DeleteButton onConfirm={()=>onDeleteLead(l.id)} label="lead"/></div>))}</>}</div></>}
      {showForm&&<div className="aa-overlay" onClick={()=>setShowForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}><div className="aa-sheet__handle"/><div className="aa-sheet__title">{editing?'Editar cliente':'Nuevo cliente'}</div><label className="aa-label">Nombre</label><input className="aa-input" value={form.nombre||''} onChange={e=>setForm({...form,nombre:e.target.value})}/><label className="aa-label">Teléfono</label><input className="aa-input" value={form.telefono||''} onChange={e=>setForm({...form,telefono:e.target.value})}/><label className="aa-label">Dirección</label><input className="aa-input" value={form.direccion||''} onChange={e=>setForm({...form,direccion:e.target.value})}/><label className="aa-label">Frecuencia estimada (veces/semana)</label><input type="number" className="aa-input" value={form.frecuencia||''} onChange={e=>setForm({...form,frecuencia:e.target.value})}/><label className="aa-label">Notas</label><textarea className="aa-input aa-textarea" value={form.notas||''} onChange={e=>setForm({...form,notas:e.target.value})}/><button className="aa-submit aa-submit--brass" onClick={submit}>Guardar</button>{editing&&<button className="aa-submit aa-submit--danger" onClick={()=>{onDeleteCliente(editing);setShowForm(false)}}>Eliminar cliente</button>}<button className="aa-sheet__close" onClick={()=>setShowForm(false)}><X size={16}/> Cerrar</button></div></div>}
      {showLeadForm&&<div className="aa-overlay" onClick={()=>setShowLeadForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}><div className="aa-sheet__handle"/><div className="aa-sheet__title">Nuevo lead</div><label className="aa-label">Nombre</label><input className="aa-input" value={leadForm.nombre||''} onChange={e=>setLeadForm({...leadForm,nombre:e.target.value})}/><label className="aa-label">Teléfono</label><input className="aa-input" value={leadForm.telefono||''} onChange={e=>setLeadForm({...leadForm,telefono:e.target.value})}/><label className="aa-label">Gremio que pide</label><input className="aa-input" list="aa-gr" value={leadForm.gremio||''} onChange={e=>setLeadForm({...leadForm,gremio:e.target.value})}/><datalist id="aa-gr">{GREMIOS_SUGERIDOS.map(g=><option key={g} value={g}/>)}</datalist><label className="aa-label">Mensaje</label><textarea className="aa-input aa-textarea" value={leadForm.mensaje||''} onChange={e=>setLeadForm({...leadForm,mensaje:e.target.value})}/><button className="aa-submit aa-submit--brass" onClick={submitLead}>Guardar lead</button><button className="aa-sheet__close" onClick={()=>setShowLeadForm(false)}><X size={16}/> Cerrar</button></div></div>}
    </div>
  )
}

export { todayISO }
