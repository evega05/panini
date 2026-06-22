import { useState } from 'react'
import { Plus, Phone, X, Check, MessageCircle, MapPin } from 'lucide-react'
import type { Prospecto } from '../types'
import { todayISO } from '../utils'
import { DeleteButton, EmptyState } from './shared'

const CATEGORIAS = [
  {label:'Restaurantes',emoji:'🍽️'},
  {label:'Bares y cafeterías',emoji:'☕'},
  {label:'Hoteles',emoji:'🏨'},
  {label:'Oficinas',emoji:'🏢'},
  {label:'Tiendas y locales',emoji:'🛍️'},
  {label:'Clínicas',emoji:'🏥'},
  {label:'Gimnasios',emoji:'💪'},
  {label:'Peluquerías',emoji:'💇'},
  {label:'Academias',emoji:'📚'},
  {label:'Comunidades de vecinos',emoji:'🏘️'},
  {label:'Naves industriales',emoji:'🏭'},
  {label:'Farmacias',emoji:'💊'},
]

const MSG = encodeURIComponent('Hola, somos Multiservicios Provenza, empresa de reformas y mantenimiento en Bilbao. ¿Les interesaría recibir un presupuesto gratuito para alguna reforma o mejora de sus instalaciones? 🔨')

const ESTADO_COLOR:Record<string,string> = {pendiente:'#9AA0AC',contactado:'#C9A227',interesado:'#4CAF50',descartado:'#E2625A'}
const ESTADO_LABEL:Record<string,string> = {pendiente:'Sin contactar',contactado:'Contactados',interesado:'Interesados',descartado:'Descartados'}

export function ProspeccionView({prospectos,onAdd,onUpdate,onDelete}:{prospectos:Prospecto[];onAdd:(d:Omit<Prospecto,'id'>)=>void;onUpdate:(id:string,d:Partial<Prospecto>)=>void;onDelete:(id:string)=>void}) {
  const [showForm,setShowForm]=useState(false)
  const [form,setForm]=useState({nombre:'',categoria:'',telefono:'',notas:''})
  const sf=(k:string,v:string)=>setForm(f=>({...f,[k]:v}))

  const openMaps=(cat:string)=>window.open(`https://www.google.com/maps/search/${encodeURIComponent(cat+' en Bilbao')}`,'_blank')

  const waUrl=(tel:string)=>{const n=tel.replace(/\D/g,'');return`https://wa.me/${n.startsWith('34')?n:'34'+n}?text=${MSG}`}

  const submit=()=>{if(!form.nombre.trim())return;onAdd({...form,estado:'pendiente',fecha:todayISO()});setForm({nombre:'',categoria:'',telefono:'',notas:''});setShowForm(false)}

  const grupos = (['interesado','contactado','pendiente','descartado'] as const).map(e=>({
    estado:e, list:prospectos.filter(p=>p.estado===e)
  })).filter(g=>g.list.length>0)

  return (
    <div className="aa-view">
      <div className="aa-viewheader">
        <span>Prospección Bilbao</span>
        <button className="aa-addsmall" onClick={()=>setShowForm(true)}><Plus size={14}/> Añadir</button>
      </div>

      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,color:'#9AA0AC',marginBottom:8,display:'flex',alignItems:'center',gap:4}}>
          <MapPin size={11}/> Toca una categoría para buscar en Google Maps
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
          {CATEGORIAS.map(c=>(
            <button key={c.label} onClick={()=>openMaps(c.label)}
              style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'8px 4px',color:'#F2EEE4',fontSize:11,cursor:'pointer',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
              <span style={{fontSize:18}}>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {prospectos.length===0&&<EmptyState text="Busca negocios arriba, luego añádelos aquí con su teléfono."/>}

      <div className="aa-clientlist">
        {grupos.map(({estado,list})=>(
          <div key={estado} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:ESTADO_COLOR[estado],letterSpacing:'0.08em',marginBottom:6,textTransform:'uppercase'}}>
              {ESTADO_LABEL[estado]} ({list.length})
            </div>
            {list.map(p=>(
              <div key={p.id} className="aa-clientcard">
                <div className="aa-clientcard__top">
                  <span className="aa-clientcard__name">{p.nombre}</span>
                  {p.categoria&&<span className="aa-tag aa-tag--gremio">{p.categoria}</span>}
                </div>
                {p.telefono&&<div className="aa-clientcard__row"><span><Phone size={11} style={{verticalAlign:-1,marginRight:3}}/>{p.telefono}</span></div>}
                {p.notas&&<div className="aa-clientcard__sub" style={{fontSize:11,opacity:0.8}}>{p.notas}</div>}
                <div className="aa-leadactions" style={{marginTop:8,flexWrap:'wrap'}}>
                  {p.telefono&&(
                    <a href={waUrl(p.telefono)} target="_blank" rel="noopener noreferrer"
                      className="aa-addsmall aa-addsmall--brass" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
                      <MessageCircle size={13}/> WhatsApp
                    </a>
                  )}
                  {p.estado==='pendiente'&&<button className="aa-addsmall" onClick={()=>onUpdate(p.id,{estado:'contactado'})}>Marcar contactado</button>}
                  {p.estado==='contactado'&&<button className="aa-addsmall" style={{color:'#4CAF50',borderColor:'rgba(76,175,80,0.4)'}} onClick={()=>onUpdate(p.id,{estado:'interesado'})}><Check size={13}/> Interesado</button>}
                  {p.estado!=='descartado'&&<button className="aa-addsmall" style={{color:'#E2625A',borderColor:'rgba(226,98,90,0.3)'}} onClick={()=>onUpdate(p.id,{estado:'descartado'})}>Descartar</button>}
                  {p.estado==='descartado'&&<button className="aa-addsmall" onClick={()=>onUpdate(p.id,{estado:'pendiente'})}>Recuperar</button>}
                  <DeleteButton onConfirm={()=>onDelete(p.id)} label="prospecto"/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showForm&&<div className="aa-overlay" onClick={()=>setShowForm(false)}><div className="aa-sheet" onClick={e=>e.stopPropagation()}>
        <div className="aa-sheet__handle"/>
        <div className="aa-sheet__title">Nuevo prospecto</div>
        <label className="aa-label">Nombre del negocio</label>
        <input className="aa-input" value={form.nombre} onChange={e=>sf('nombre',e.target.value)} placeholder="Ej. Bar Bilbao Centro"/>
        <label className="aa-label">Categoría</label>
        <input className="aa-input" list="aa-pc" value={form.categoria} onChange={e=>sf('categoria',e.target.value)} placeholder="Restaurante, oficina…"/>
        <datalist id="aa-pc">{CATEGORIAS.map(c=><option key={c.label} value={c.label}/>)}</datalist>
        <label className="aa-label">Teléfono</label>
        <input className="aa-input" type="tel" value={form.telefono} onChange={e=>sf('telefono',e.target.value)} placeholder="946 123 456"/>
        <label className="aa-label">Notas</label>
        <textarea className="aa-input aa-textarea" value={form.notas} onChange={e=>sf('notas',e.target.value)} placeholder="Lo que te haya llamado la atención…"/>
        <button className="aa-submit aa-submit--brass" onClick={submit}>Guardar</button>
        <button className="aa-sheet__close" onClick={()=>setShowForm(false)}><X size={16}/> Cerrar</button>
      </div></div>}
    </div>
  )
}
