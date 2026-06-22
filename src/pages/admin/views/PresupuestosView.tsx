import { useState, useMemo, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { Plus, Users, Check, ChevronLeft, ArrowRightCircle, Tag, X, FileText } from 'lucide-react'
import type { Cliente, Presupuesto, PresupuestoLinea, CatalogoItem, Factura } from '../types'
import { GREMIOS_SUGERIDOS, ESTADOS_PRESUPUESTO, UNIDADES } from '../types'
import { todayISO, uid, fmt } from '../utils'
import { DeleteButton, EmptyState } from './shared'

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

export function PresupuestosView({presupuestos,presupuestolineas,clientes,facturas,onAddPresupuestoWithLineas,onUpdatePresupuesto,onAddLinea,onDeleteLinea,onConvertirObra,onAddFactura,onUpdateFactura,onDeleteFactura}:{presupuestos:Presupuesto[];presupuestolineas:PresupuestoLinea[];clientes:Cliente[];facturas:Factura[];onAddPresupuestoWithLineas:(form:Record<string,unknown>,lineas:PresupuestoLinea[])=>void;onUpdatePresupuesto:(id:string,d:Partial<Presupuesto>)=>void;onAddLinea:(presupuestoId:string,d:Omit<PresupuestoLinea,'id'|'presupuestoId'>)=>void;onDeleteLinea:(id:string)=>void;onConvertirObra:(p:Presupuesto)=>void;onAddFactura:(d:Omit<Factura,'id'|'clienteId'>&{clienteNombre:string})=>void;onUpdateFactura:(id:string,d:Partial<Factura>)=>void;onDeleteFactura:(id:string)=>void}) {
  const [subView,setSubView]=useState('presupuestos')
  const [editingId,setEditingId]=useState<string|null>(null)
  const [showFacturaForm,setShowFacturaForm]=useState(false)
  const [facturaForm,setFacturaForm]=useState<Record<string,string|boolean>>({})
  const [aiKey,setAiKey]=useState(()=>localStorage.getItem('provenza_ai_key')||'')
  const [keyInput,setKeyInput]=useState('')
  const [showKeyInput,setShowKeyInput]=useState(false)
  const [extracting,setExtracting]=useState(false)
  const uploadRef=useRef<HTMLInputElement>(null)
  const saveAiKey=(k:string)=>{const t=k.trim();setAiKey(t);localStorage.setItem('provenza_ai_key',t);setShowKeyInput(false)}
  const pdfToImageBase64=async(file:File):Promise<string>=>{
    const arrayBuffer=await file.arrayBuffer()
    pdfjsLib.GlobalWorkerOptions.workerSrc=pdfjsWorkerUrl
    const pdf=await pdfjsLib.getDocument({data:arrayBuffer}).promise
    const page=await pdf.getPage(1)
    const viewport=page.getViewport({scale:2})
    const canvas=document.createElement('canvas')
    canvas.width=viewport.width
    canvas.height=viewport.height
    await page.render({canvasContext:canvas.getContext('2d')!,viewport,canvas}).promise
    return canvas.toDataURL('image/png').split(',')[1]
  }
  const extractFromPDF=async(file:File)=>{
    if(!aiKey)return
    setExtracting(true)
    try{
      const imgBase64=await pdfToImageBase64(file)
      const res=await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${aiKey}`,'HTTP-Referer':'https://multiservicios-provenza.vercel.app','X-Title':'Provenza Panel'},
        body:JSON.stringify({
          model:'meta-llama/llama-3.2-11b-vision-instruct',
          messages:[{role:'user',content:[
            {type:'text',text:'Extrae datos de esta factura y responde ÚNICAMENTE con JSON sin markdown: {"numero":"FAC-001","clienteNombre":"Empresa SA","fecha":"2024-01-15","concepto":"Descripción del servicio","total":1000,"iva":true}. El total debe ser el importe sin IVA (número). Usa null para campos no encontrados.'},
            {type:'image_url',image_url:{url:`data:image/png;base64,${imgBase64}`}}
          ]}]
        })}
      )
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(`${res.status}: ${err?.error?.message||res.statusText}`)}
      const d=await res.json()
      const txt=d.choices?.[0]?.message?.content||''
      const m=txt.match(/\{[\s\S]*\}/)
      if(!m)throw new Error('Sin datos en la respuesta')
      const ex=JSON.parse(m[0])
      setFacturaForm(f=>({
        ...f,
        ...(ex.numero?{numero:ex.numero}:{}),
        ...(ex.clienteNombre?{clienteNombre:ex.clienteNombre}:{}),
        ...(ex.fecha?{fecha:ex.fecha}:{}),
        ...(ex.concepto?{concepto:ex.concepto}:{}),
        ...(ex.total!=null?{total:String(ex.total)}:{}),
        ...(ex.iva!=null?{iva:ex.iva}:{}),
      }))
    }catch(e){console.error('openrouter pdf',e);alert('Error al leer el PDF: '+(e instanceof Error?e.message:String(e)))}
    finally{setExtracting(false)}
  }
  const nextNumero=useMemo(()=>{const nums=facturas.map(f=>parseInt(f.numero.replace(/\D/g,''))||0);const max=nums.length?Math.max(...nums):0;return`FAC-${String(max+1).padStart(3,'0')}`},[facturas])
  const submitFactura=()=>{if(!facturaForm.concepto||!facturaForm.total)return;onAddFactura({numero:String(facturaForm.numero||nextNumero),clienteNombre:String(facturaForm.clienteNombre||''),fecha:String(facturaForm.fecha||todayISO()),concepto:String(facturaForm.concepto),total:Number(facturaForm.total),iva:Boolean(facturaForm.iva),estado:'pendiente',notas:String(facturaForm.notas||'')});setFacturaForm({});setShowFacturaForm(false)}
  const catalogo=useMemo(()=>{const map:Record<string,CatalogoItem&{precios:number[]}>={};presupuestolineas.forEach(l=>{const key=(l.concepto||'').trim().toLowerCase();if(!key)return;const pres=presupuestos.find(p=>p.id===l.presupuestoId);if(!map[key])map[key]={concepto:'',gremio:'',unidad:'',ultimoPrecio:0,promedio:0,vecesUsado:0,precios:[],ultimaFecha:''};map[key].precios.push(Number(l.precioUnitario)||0);map[key].vecesUsado+=1;if(pres&&pres.fecha>=map[key].ultimaFecha){map[key].ultimaFecha=pres.fecha;map[key].concepto=l.concepto.trim();map[key].gremio=l.gremio;map[key].unidad=l.unidad;map[key].ultimoPrecio=Number(l.precioUnitario)||0}});return Object.values(map).map(c=>({...c,promedio:c.precios.reduce((s,x)=>s+x,0)/c.precios.length})).sort((a,b)=>b.vecesUsado-a.vecesUsado)},[presupuestolineas,presupuestos])
  const totalDe=(id:string)=>{const ls=presupuestolineas.filter(l=>l.presupuestoId===id);return ls.reduce((s,l)=>s+(Number(l.cantidad)||0)*(Number(l.precioUnitario)||0),0)}
  const facturasPorCliente=useMemo(()=>{const g:Record<string,Factura[]>={};facturas.forEach(f=>{const k=f.clienteId||'__sin__';if(!g[k])g[k]=[];g[k].push(f)});return Object.entries(g).map(([cid,cf])=>({clienteId:cid,clienteNombre:cid==='__sin__'?'Sin cliente':(clientes.find(c=>c.id===cid)?.nombre||'Sin cliente'),facturas:[...cf].sort((a,b)=>b.fecha.localeCompare(a.fecha)),total:cf.reduce((s,f)=>s+(f.iva?Number(f.total)*1.21:Number(f.total)),0),cobrado:cf.reduce((s,f)=>s+(f.estado==='cobrada'?(f.iva?Number(f.total)*1.21:Number(f.total)):0),0)}))},[facturas,clientes])
  if(editingId==='new') return <PresupuestoEditorView presupuesto={null} lineas={[]} clientes={clientes} catalogo={catalogo} onSaveAndClose={(form,ll)=>{onAddPresupuestoWithLineas(form,ll);setEditingId(null)}} onAddLinea={()=>{}} onDeleteLinea={()=>{}} onClose={()=>setEditingId(null)}/>
  if(editingId){const p=presupuestos.find(x=>x.id===editingId);if(!p){setEditingId(null);return null}const lineas=presupuestolineas.filter(l=>l.presupuestoId===editingId);return <PresupuestoEditorView presupuesto={p} lineas={lineas} clientes={clientes} catalogo={catalogo} onSaveAndClose={()=>{}} onSavePresupuesto={onUpdatePresupuesto} onAddLinea={d=>onAddLinea(editingId,d)} onDeleteLinea={onDeleteLinea} onClose={()=>setEditingId(null)}/>}
  return (
    <div className="aa-view">
      <div className="aa-subtabs">
        <button className={`aa-subtab${subView==='presupuestos'?' is-active':''}`} onClick={()=>setSubView('presupuestos')}>Presupuestos</button>
        <button className={`aa-subtab${subView==='facturas'?' is-active':''}`} onClick={()=>setSubView('facturas')}>Facturas</button>
        <button className={`aa-subtab${subView==='catalogo'?' is-active':''}`} onClick={()=>setSubView('catalogo')}>Catálogo</button>
      </div>
      {subView==='presupuestos'&&<><div className="aa-viewheader"><span>Presupuestos</span><button className="aa-addsmall" onClick={()=>setEditingId('new')}><Plus size={14}/> Nuevo</button></div>{presupuestos.length===0&&<EmptyState text="Sin presupuestos todavía."/>}<div className="aa-clientlist">{[...presupuestos].sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(p=>{const sub=totalDe(p.id);const iva=p.iva?sub*0.21:0;const tot=sub+iva;const lc=presupuestolineas.filter(l=>l.presupuestoId===p.id).length;const cn=clientes.find(c=>c.id===p.clienteId)?.nombre||'Sin cliente';return(<div key={p.id} className="aa-clientcard" onClick={()=>setEditingId(p.id)} style={{cursor:'pointer'}}><div className="aa-clientcard__top"><span className="aa-clientcard__name">{p.nombre}</span><span className={`aa-tag aa-tag--estado-${(p.estado||'').toLowerCase()}`}>{p.estado}</span></div><div className="aa-clientcard__row"><span><Users size={11}/> {cn}</span><span>{p.fecha}</span></div><div className="aa-clientcard__sub"><strong>{fmt(tot)} €</strong>{p.iva?' IVA inc.':''} · {lc} {lc===1?'partida':'partidas'}</div>{p.estado==='Aceptado'&&<div style={{marginTop:8}} onClick={e=>e.stopPropagation()}><button className="aa-addsmall aa-addsmall--brass" onClick={()=>onConvertirObra(p)}><ArrowRightCircle size={13}/> Convertir en obra</button></div>}</div>)})}</div></>}
      {subView==='facturas'&&<>
        <div className="aa-viewheader">
          <span>Facturas <span className="aa-tag aa-tag--money">{fmt(facturas.reduce((s,f)=>s+(f.estado==='cobrada'?Number(f.total):0),0))} € cobrado</span></span>
          <div style={{display:'flex',gap:6}}>
            <button className="aa-addsmall" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)'}} onClick={()=>{setKeyInput(aiKey);setShowKeyInput(true);setShowFacturaForm(false)}}>⚙ Clave IA</button>
            <button className="aa-addsmall" onClick={()=>{setFacturaForm({numero:nextNumero,fecha:todayISO()});setShowFacturaForm(true)}}><Plus size={14}/> Nueva</button>
          </div>
        </div>
        {showKeyInput&&!showFacturaForm&&<div style={{margin:'0 0 12px',padding:'10px 12px',background:'rgba(201,162,39,0.08)',border:'1px solid rgba(201,162,39,0.3)',borderRadius:10}}>
          <div style={{fontSize:12,color:'#C9A227',marginBottom:8}}>Clave OpenRouter (para leer PDFs con IA)</div>
          <div style={{display:'flex',gap:6}}>
            <input className="aa-input" style={{flex:1,fontSize:12}} placeholder="sk-or-v1-..." value={keyInput} onChange={e=>setKeyInput(e.target.value)}/>
            <button className="aa-addsmall aa-addsmall--brass" onClick={()=>saveAiKey(keyInput)}>Guardar</button>
            <button className="aa-addsmall" onClick={()=>setShowKeyInput(false)}>✕</button>
          </div>
          {aiKey&&<div style={{fontSize:11,color:'#9AA0AC',marginTop:6}}>Clave actual: ...{aiKey.slice(-8)}</div>}
        </div>}
        {facturas.length===0&&<EmptyState text="Sin facturas todavía."/>}
        <div className="aa-clientlist">{facturasPorCliente.map(({clienteId,clienteNombre,facturas:cf,total,cobrado})=>(
          <div key={clienteId} style={{marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 4px 7px',borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:6}}>
              <span style={{fontWeight:600,fontSize:13}}><Users size={12} style={{marginRight:4,verticalAlign:-2}}/>{clienteNombre}</span>
              <span style={{fontSize:12,color:'#9AA0AC'}}>{fmt(cobrado)} / {fmt(total)} €</span>
            </div>
            {cf.map(f=>{const totalConIva=f.iva?Number(f.total)*1.21:Number(f.total);return(
              <div key={f.id} className="aa-clientcard">
                <div className="aa-clientcard__top">
                  <span className="aa-clientcard__name"><FileText size={13} style={{marginRight:5,verticalAlign:-2}}/>{f.numero}</span>
                  <span className={`aa-tag${f.estado==='cobrada'?' aa-tag--money':' aa-tag--estado-enviado'}`}>{f.estado==='cobrada'?'Cobrada':'Pendiente'}</span>
                </div>
                <div className="aa-clientcard__row"><span>{f.fecha}</span><span>{f.concepto}</span></div>
                <div className="aa-clientcard__sub"><strong>{fmt(totalConIva)} €</strong>{f.iva?' (IVA inc.)':''}</div>
                <div className="aa-leadactions">
                  {f.estado==='pendiente'&&<button className="aa-addsmall aa-addsmall--brass" onClick={()=>onUpdateFactura(f.id,{estado:'cobrada'})}><Check size={13}/> Marcar cobrada</button>}
                  {f.estado==='cobrada'&&<button className="aa-addsmall" onClick={()=>onUpdateFactura(f.id,{estado:'pendiente'})}>Desmarcar</button>}
                  <DeleteButton onConfirm={()=>onDeleteFactura(f.id)} label="factura"/>
                </div>
              </div>
            )})}
          </div>
        ))}</div>
        {showFacturaForm&&<div className="aa-overlay" onClick={()=>setShowFacturaForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}>
          <div className="aa-sheet__handle"/>
          <div className="aa-sheet__title">Nueva factura</div>
          <input ref={uploadRef} type="file" accept="application/pdf" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)extractFromPDF(f);e.target.value=''}}/>
          {(aiKey&&!showKeyInput)
            ?<div style={{marginBottom:14}}>
              <button className="aa-addsmall" onClick={()=>uploadRef.current?.click()} disabled={extracting} style={{width:'100%',justifyContent:'center',display:'flex',gap:6,fontSize:13,marginBottom:4}}>{extracting?'Analizando PDF…':'📄 Rellenar desde PDF'}</button>
              <div style={{textAlign:'center'}}><button style={{background:'none',border:'none',color:'#9AA0AC',fontSize:11,cursor:'pointer',padding:0}} onClick={()=>{setKeyInput('');setShowKeyInput(true)}}>Cambiar clave IA</button></div>
            </div>
            :<div style={{marginBottom:14,padding:'8px 10px',background:'rgba(201,162,39,0.08)',border:'1px solid rgba(201,162,39,0.25)',borderRadius:8}}>
              <div style={{fontSize:11,color:'#C9A227',marginBottom:6}}>Clave OpenRouter para subir PDFs</div>
              <div style={{display:'flex',gap:6}}>
                <input className="aa-input" style={{flex:1,fontSize:12}} placeholder="sk-or-v1-..." value={keyInput} onChange={e=>setKeyInput(e.target.value)}/>
                <button className="aa-addsmall aa-addsmall--brass" onClick={()=>saveAiKey(keyInput)}>OK</button>
              </div>
            </div>
          }
          <div className="aa-row2">
            <div><label className="aa-label">Número</label><input className="aa-input" value={String(facturaForm.numero||'')} onChange={e=>setFacturaForm({...facturaForm,numero:e.target.value})}/></div>
            <div><label className="aa-label">Fecha</label><input type="date" className="aa-input" value={String(facturaForm.fecha||'')} onChange={e=>setFacturaForm({...facturaForm,fecha:e.target.value})}/></div>
          </div>
          <label className="aa-label">Cliente</label>
          <input className="aa-input" list="aa-fac-cl" value={String(facturaForm.clienteNombre||'')} onChange={e=>setFacturaForm({...facturaForm,clienteNombre:e.target.value})} placeholder="Nombre del cliente"/>
          <datalist id="aa-fac-cl">{clientes.map(c=><option key={c.id} value={c.nombre}/>)}</datalist>
          <label className="aa-label">Concepto</label>
          <input className="aa-input" value={String(facturaForm.concepto||'')} onChange={e=>setFacturaForm({...facturaForm,concepto:e.target.value})} placeholder="Ej. Reforma baño C/ Mayor"/>
          <label className="aa-label">Total (€, sin IVA)</label>
          <input type="number" className="aa-input" value={String(facturaForm.total||'')} onChange={e=>setFacturaForm({...facturaForm,total:e.target.value})}/>
          <label className="aa-label" style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
            <input type="checkbox" checked={Boolean(facturaForm.iva)} onChange={e=>setFacturaForm({...facturaForm,iva:e.target.checked})}/>
            Aplicar IVA 21%
          </label>
          <label className="aa-label">Notas</label>
          <textarea className="aa-input aa-textarea" value={String(facturaForm.notas||'')} onChange={e=>setFacturaForm({...facturaForm,notas:e.target.value})}/>
          <button className="aa-submit aa-submit--brass" onClick={submitFactura}>Guardar factura</button>
          <button className="aa-sheet__close" onClick={()=>setShowFacturaForm(false)}><X size={16}/> Cerrar</button>
        </div></div>}
      </>}
      {subView==='catalogo'&&<><div className="aa-viewheader"><span>Catálogo de precios</span></div>{catalogo.length===0?<EmptyState text="Se llena solo al añadir partidas a los presupuestos."/>:<div className="aa-clientlist">{catalogo.map(c=>(<div key={c.concepto} className="aa-clientcard"><div className="aa-clientcard__top"><span className="aa-clientcard__name"><Tag size={13} style={{marginRight:4,verticalAlign:-2}}/>{c.concepto}</span>{c.gremio&&<span className="aa-tag aa-tag--gremio">{c.gremio}</span>}</div><div className="aa-clientcard__sub">Último: <strong>{fmt(c.ultimoPrecio)} € / {c.unidad}</strong> · Promedio: {fmt(c.promedio)} € · usado {c.vecesUsado} {c.vecesUsado===1?'vez':'veces'}</div></div>))}</div>}</>}
    </div>
  )
}
