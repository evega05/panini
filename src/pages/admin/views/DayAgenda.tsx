import { useState, useEffect } from 'react'
import { Hammer, Banknote, ListChecks, Check, X, MapPin } from 'lucide-react'
import type { Cliente, Visita, Cobro, Tarea } from '../types'
import { todayISO } from '../utils'
import { Stamp, DeleteButton, EmptyState } from './shared'

export function DayAgenda({date,data,onToggleEstado,onToggleTarea,onDelete}:{date:string;data:{clientes:Cliente[];visitas:Visita[];cobros:Cobro[];tareas:Tarea[]};onToggleEstado:(t:string,id:string)=>void;onToggleTarea:(id:string)=>void;onDelete:(col:string,id:string)=>void}) {
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

export function AddSheet({open,onClose,clientes,defaultDate,onCreate}:{open:boolean;onClose:()=>void;clientes:Cliente[];defaultDate:string;onCreate:(type:string,payload:Record<string,unknown>)=>void}) {
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

export { todayISO }
