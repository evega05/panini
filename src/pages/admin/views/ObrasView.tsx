import { useState } from 'react'
import { Plus, Users, MapPin, X, Check, Pencil, UserPlus, MessageCircle } from 'lucide-react'
import type { Obra, ObraItem, Asignacion, Empleado } from '../types'
import { GREMIOS_SUGERIDOS, ESTADOS_OBRA } from '../types'
import { todayISO, waLink } from '../utils'
import { DeleteButton, EmptyState } from './shared'

export function ObrasView({obras,obraitems,asignaciones,empleados,onAddObra,onUpdateObra,onDeleteObra,onAddItem,onToggleItem,onDeleteItem,onAddAsignacion,onDeleteAsignacion}:{obras:Obra[];obraitems:ObraItem[];asignaciones:Asignacion[];empleados:Empleado[];onAddObra:(d:Partial<Obra>)=>void;onUpdateObra:(id:string,d:Partial<Obra>)=>void;onDeleteObra:(id:string)=>void;onAddItem:(obraId:string,d:Partial<ObraItem>)=>void;onToggleItem:(id:string)=>void;onDeleteItem:(id:string)=>void;onAddAsignacion:(obraId:string,d:Partial<Asignacion>)=>void;onDeleteAsignacion:(id:string)=>void}) {
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
