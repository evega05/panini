import { useState, useMemo } from 'react'
import { Plus, Phone, X, Check, Clock, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Empleado, Pago, Jornada, Obra, ObraItem, Asignacion } from '../types'
import { todayISO, addDays, weekDaysOf, dayLabel, dayNum, monthKey, fmt } from '../utils'
import { DeleteButton, EmptyState } from './shared'

export function EmpleadosView({empleados,pagos,jornadas,onAddEmpleado,onDeleteEmpleado,onAddPago,onCycleJornada,onMarkAllPaid}:{empleados:Empleado[];pagos:Pago[];jornadas:Jornada[];obras:Obra[];obraitems:ObraItem[];asignaciones:Asignacion[];onAddEmpleado:(d:Record<string,string>)=>void;onDeleteEmpleado:(id:string)=>void;onAddPago:(eid:string,d:Omit<Pago,'id'|'empleadoId'>)=>void;onCycleJornada:(eid:string,fecha:string)=>void;onMarkAllPaid:(eid:string)=>void}) {
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
