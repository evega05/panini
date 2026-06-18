import { useState, useEffect, useMemo } from 'react'
import {
  Plus, CalendarDays, Users, Wallet,
  ChevronLeft, ChevronRight, Clock, Sun, HardHat, Lock,
  Megaphone, Receipt,
} from 'lucide-react'
import type {
  Cliente, Visita, Cobro, Tarea, Empleado, Pago, Jornada,
  Obra, ObraItem, Asignacion, Lead, Presupuesto, PresupuestoLinea, Factura,
} from './types'
import { loadAll, persist } from './storage'
import { uid, todayISO, addDays, weekDaysOf, dayLabel, dayNum, longLabel } from './utils'
import { CSS } from './panelCss'
import { DayAgenda, AddSheet } from './views/DayAgenda'
import { ClientesView } from './views/ClientesView'
import { ObrasView } from './views/ObrasView'
import { PresupuestosView } from './views/PresupuestosView'
import { EmpleadosView } from './views/EmpleadosView'

const PANEL_PASSWORD = 'provenza2024'
const SESSION_KEY = 'provenza_panel_auth'

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
  const [facturas,setFacturas]=useState<Factura[]>([])

  useEffect(()=>{
    const d=loadAll()
    setClientes(d.clientes as Cliente[]); setVisitas(d.visitas as Visita[]); setCobros(d.cobros as Cobro[])
    setTareas(d.tareas as Tarea[]); setEmpleados(d.empleados as Empleado[]); setPagos(d.pagos as Pago[])
    setJornadas(d.jornadas as Jornada[]); setObras(d.obras as Obra[]); setObraitems(d.obraitems as ObraItem[])
    setAsignaciones(d.asignaciones as Asignacion[]); setLeads(d.leads as Lead[])
    setPresupuestos(d.presupuestos as Presupuesto[]); setPresupuestolineas(d.presupuestolineas as PresupuestoLinea[])
    setFacturas(d.facturas as Factura[])
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
  const addFactura=(data:Omit<Factura,'id'|'clienteId'>&{clienteNombre:string})=>{const{id:clienteId,list:nc}=findOrCreateCliente(data.clienteNombre,clientes);if(nc!==clientes){setClientes(nc);persist('clientes',nc)}const next=[...facturas,{id:uid(),clienteId,numero:data.numero,fecha:data.fecha,concepto:data.concepto,total:data.total,iva:data.iva,estado:data.estado,notas:data.notas}];setFacturas(next);persist('facturas',next)}
  const updateFactura=(id:string,data:Partial<Factura>)=>{const next=facturas.map(f=>f.id===id?{...f,...data}:f);setFacturas(next);persist('facturas',next)}
  const deleteFactura=(id:string)=>{const next=facturas.filter(f=>f.id!==id);setFacturas(next);persist('facturas',next)}
  const convertirObra=(p:Presupuesto)=>{const c=clientes.find(x=>x.id===p.clienteId);addObra({nombre:p.nombre,cliente:c?.nombre||'',direccion:c?.direccion||'',estado:'En curso',fechaInicio:todayISO(),notas:`Generada desde presupuesto "${p.nombre}"`})}
  const addObra=(data:Partial<Obra>)=>{const next=[...obras,{id:uid(),cliente:'',direccion:'',notas:'',...data} as Obra];setObras(next);persist('obras',next)}
  const updateObra=(id:string,data:Partial<Obra>)=>{const next=obras.map(o=>o.id===id?{...o,...data}:o);setObras(next);persist('obras',next)}
  const deleteObra=(id:string)=>{const no=obras.filter(o=>o.id!==id);setObras(no);persist('obras',no);const ni=obraitems.filter(i=>i.obraId!==id);setObraitems(ni);persist('obraitems',ni);const na=asignaciones.filter(a=>a.obraId!==id);setAsignaciones(na);persist('asignaciones',na)}
  const addObraItem=(obraId:string,data:Partial<ObraItem>)=>{const next=[...obraitems,{id:uid(),obraId,completado:false,...data} as ObraItem];setObraitems(next);persist('obraitems',next)}
  const toggleObraItem=(id:string)=>{const next=obraitems.map(i=>i.id===id?{...i,completado:!i.completado}:i);setObraitems(next);persist('obraitems',next)}
  const addAsignacion=(obraId:string,data:Partial<Asignacion>)=>{const next=[...asignaciones,{id:uid(),obraId,...data} as Asignacion];setAsignaciones(next);persist('asignaciones',next)}
  const addCliente=(data:Partial<Cliente>)=>{const next=[...clientes,{id:uid(),telefono:'',direccion:'',frecuencia:'',notas:'',...data} as Cliente];setClientes(next);persist('clientes',next)}
  const updateCliente=(id:string,data:Partial<Cliente>)=>{const next=clientes.map(c=>c.id===id?{...c,...data}:c);setClientes(next);persist('clientes',next)}
  const addCobroCliente=(clienteId:string,data:Omit<Cobro,'id'|'clienteId'>)=>{const next=[...cobros,{id:uid(),clienteId,...data}];setCobros(next);persist('cobros',next)}
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
        {view==='presupuestos'&&<PresupuestosView presupuestos={presupuestos} presupuestolineas={presupuestolineas} clientes={clientes} facturas={facturas} onAddPresupuestoWithLineas={addPresupuestoWithLineas} onUpdatePresupuesto={updatePresupuesto} onAddLinea={addLinea} onDeleteLinea={id=>deleteItem('presupuestolineas',id)} onConvertirObra={convertirObra} onAddFactura={addFactura} onUpdateFactura={updateFactura} onDeleteFactura={deleteFactura}/>}
        {view==='clientes'&&<ClientesView clientes={clientes} visitas={visitas} cobros={cobros} leads={leads} onAddCliente={addCliente} onDeleteCliente={id=>deleteItem('clientes',id)} onUpdateCliente={updateCliente} onAddCobro={addCobroCliente} onAddLead={addLead} onSetLeadEstado={setLeadEstado} onDeleteLead={id=>deleteItem('leads',id)} onConvertLead={convertLead}/>}
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
