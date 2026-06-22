import { useState } from 'react'
import { Plus, Phone, X, Check, MessageCircle, MapPin, Search, Loader } from 'lucide-react'
import type { Prospecto } from '../types'
import { todayISO } from '../utils'
import { DeleteButton, EmptyState } from './shared'

const CATEGORIAS = [
  {label:'Restaurantes',      emoji:'🍽️', osm:['"amenity"="restaurant"']},
  {label:'Bares y cafeterías',emoji:'☕',  osm:['"amenity"="bar"','"amenity"="cafe"']},
  {label:'Hoteles',           emoji:'🏨', osm:['"tourism"="hotel"','"tourism"="hostel"']},
  {label:'Oficinas',          emoji:'🏢', osm:['"office"~".+"']},
  {label:'Tiendas y locales', emoji:'🛍️', osm:['"shop"~".+"']},
  {label:'Clínicas',          emoji:'🏥', osm:['"amenity"="clinic"','"amenity"="doctors"','"amenity"="dentist"']},
  {label:'Gimnasios',         emoji:'💪', osm:['"leisure"="fitness_centre"']},
  {label:'Peluquerías',       emoji:'💇', osm:['"shop"="hairdresser"','"shop"="beauty"']},
  {label:'Academias',         emoji:'📚', osm:['"amenity"="language_school"','"amenity"="driving_school"','"amenity"="music_school"']},
  {label:'Comunidades',       emoji:'🏘️', osm:['"amenity"="community_centre"']},
  {label:'Naves industriales',emoji:'🏭', osm:['"man_made"="works"','"industrial"~".+"']},
  {label:'Farmacias',         emoji:'💊', osm:['"amenity"="pharmacy"']},
]

// Bilbao bounding box: sur,oeste,norte,este
const BBOX = '43.22,-2.98,43.30,-2.85'

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

const MSG = encodeURIComponent(`Hola 👋

Le escribimos porque trabajamos con negocios como el suyo en Bilbao y sabemos que el mantenimiento de un local siempre tiene algo pendiente.

Somos *Multiservicios Provenza* — un solo equipo para todo:
🔧 Fontanería · Electricidad · Pintura · Obra · Reformas

Sin llamar a varios gremios, sin coordinaciones, sin dolores de cabeza.

Muchos locales en Bilbao ya confían en nosotros para mantener sus instalaciones siempre a punto.

¿Le gustaría recibir una valoración *gratuita y sin compromiso*?

Responda con un 👍 y organizamos una visita esta semana 📅`)

const ESTADO_COLOR: Record<string,string> = {pendiente:'#9AA0AC',contactado:'#C9A227',interesado:'#4CAF50',descartado:'#E2625A'}
const ESTADO_LABEL: Record<string,string> = {pendiente:'Sin contactar',contactado:'Contactados',interesado:'Interesados',descartado:'Descartados'}

type Resultado = {nombre:string; direccion:string; telefono:string}

async function buscarEnBilbao(tags: string[]): Promise<Resultado[]> {
  const parts = tags.flatMap(t => [`node[${t}](${BBOX});`, `way[${t}](${BBOX});`])
  const query = `[out:json][timeout:25];\n(${parts.join('\n')});\nout center 80;`
  // Overpass requiere los datos como form-urlencoded, no como texto plano
  const body = new URLSearchParams({data: query})

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {method:'POST', body, signal: AbortSignal.timeout(20000)})
      if (!res.ok) continue
      const data = await res.json()
      return (data.elements as Record<string,any>[])
        .map(e => ({
          nombre:    e.tags?.name || e.tags?.['name:es'] || '',
          direccion: [e.tags?.['addr:street'], e.tags?.['addr:housenumber']].filter(Boolean).join(' '),
          telefono:  (e.tags?.phone || e.tags?.['contact:phone'] || '').replace(/[\s\-()]/g, ''),
        }))
        .filter(n => n.nombre)
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
    } catch {
      // intentar siguiente endpoint
    }
  }
  throw new Error('No se pudo contactar con OpenStreetMap')
}

export function ProspeccionView({prospectos,onAdd,onUpdate,onDelete}:{prospectos:Prospecto[];onAdd:(d:Omit<Prospecto,'id'>)=>void;onUpdate:(id:string,d:Partial<Prospecto>)=>void;onDelete:(id:string)=>void}) {
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState({nombre:'',categoria:'',telefono:'',notas:''})
  const [buscando, setBuscando]       = useState(false)
  const [catActual, setCatActual]     = useState('')
  const [resultados, setResultados]   = useState<Resultado[]|null>(null)
  const [errorBusq, setErrorBusq]     = useState('')
  const [editandoTel, setEditandoTel] = useState<string|null>(null)
  const [telInput, setTelInput]       = useState('')

  const sf = (k:string, v:string) => setForm(f => ({...f,[k]:v}))
  const waUrl = (tel:string) => { const n=tel.replace(/\D/g,''); return `https://wa.me/${n.startsWith('34')?n:'34'+n}?text=${MSG}` }

  const buscar = async (cat: typeof CATEGORIAS[0]) => {
    setCatActual(cat.label)
    setBuscando(true)
    setResultados(null)
    setErrorBusq('')
    try {
      const res = await buscarEnBilbao(cat.osm)
      setResultados(res)
    } catch {
      setErrorBusq('No se pudo conectar con OpenStreetMap. Comprueba la conexión.')
    } finally {
      setBuscando(false)
    }
  }

  const yaAnhadido = (nombre: string) =>
    prospectos.some(p => p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())

  const agregarResultado = (r: Resultado) => {
    onAdd({nombre:r.nombre, categoria:catActual, telefono:r.telefono, notas:r.direccion ? `Dirección: ${r.direccion}` : '', estado:'pendiente', fecha:todayISO()})
  }

  const submit = () => {
    if (!form.nombre.trim()) return
    onAdd({...form, estado:'pendiente', fecha:todayISO()})
    setForm({nombre:'',categoria:'',telefono:'',notas:''})
    setShowForm(false)
  }

  const grupos = (['interesado','contactado','pendiente','descartado'] as const)
    .map(e => ({estado:e, list:prospectos.filter(p => p.estado===e)}))
    .filter(g => g.list.length > 0)

  return (
    <div className="aa-view">
      <div className="aa-viewheader">
        <span>Prospección Bilbao</span>
        <button className="aa-addsmall" onClick={() => setShowForm(true)}><Plus size={14}/> Añadir</button>
      </div>

      {/* Cuadrícula de categorías */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,color:'#9AA0AC',marginBottom:8,display:'flex',alignItems:'center',gap:4}}>
          <Search size={11}/> Toca una categoría para buscar negocios reales en Bilbao
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
          {CATEGORIAS.map(c => (
            <button key={c.label} onClick={() => buscar(c)}
              style={{
                background: catActual===c.label ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${catActual===c.label ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius:8, padding:'8px 4px', color:'#F2EEE4', fontSize:11,
                cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              }}>
              <span style={{fontSize:18}}>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Estado de búsqueda */}
      {buscando && (
        <div style={{textAlign:'center',padding:'20px 0',color:'#9AA0AC',fontSize:13}}>
          <Loader size={20} className="aa-spin" style={{display:'block',margin:'0 auto 8px'}}/>
          Buscando {catActual} en Bilbao…
        </div>
      )}
      {errorBusq && (
        <div style={{background:'rgba(226,98,90,0.08)',border:'1px solid rgba(226,98,90,0.25)',borderRadius:8,padding:'12px',margin:'8px 0',textAlign:'center'}}>
          <div style={{color:'#E2625A',fontSize:12,marginBottom:8}}>{errorBusq}</div>
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(catActual+' en Bilbao')}`} target="_blank" rel="noopener noreferrer"
            className="aa-addsmall" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}}>
            <MapPin size={12}/> Buscar en Google Maps
          </a>
        </div>
      )}

      {/* Lista de resultados de OpenStreetMap */}
      {resultados !== null && !buscando && (
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:'#C9A227',letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{catActual} — {resultados.length} encontrados</span>
            <button onClick={() => {setResultados(null); setCatActual('')}}
              style={{background:'none',border:'none',color:'#9AA0AC',cursor:'pointer',padding:'0 4px'}}>
              <X size={14}/>
            </button>
          </div>
          {resultados.length === 0 && (
            <div style={{color:'#9AA0AC',fontSize:12,textAlign:'center',padding:'12px 0'}}>
              Sin resultados en OpenStreetMap. Prueba otra categoría o usa Google Maps.
            </div>
          )}
          {resultados.map((r,i) => {
            const ya = yaAnhadido(r.nombre)
            return (
              <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 12px',marginBottom:6,display:'flex',alignItems:'flex-start',gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,color:'#F2EEE4',marginBottom:2}}>{r.nombre}</div>
                  {r.direccion && <div style={{fontSize:11,color:'#9AA0AC'}}><MapPin size={10} style={{verticalAlign:-1,marginRight:2}}/>{r.direccion}</div>}
                  {r.telefono  && <div style={{fontSize:11,color:'#9AA0AC'}}><Phone size={10} style={{verticalAlign:-1,marginRight:2}}/>{r.telefono}</div>}
                </div>
                <button onClick={() => !ya && agregarResultado(r)} disabled={ya}
                  style={{flexShrink:0,background:ya?'transparent':'rgba(201,162,39,0.15)',border:`1px solid ${ya?'rgba(76,175,80,0.4)':'rgba(201,162,39,0.4)'}`,borderRadius:6,padding:'5px 10px',color:ya?'#4CAF50':'#C9A227',fontSize:11,cursor:ya?'default':'pointer',fontWeight:600,display:'flex',alignItems:'center'}}>
                  {ya ? <Check size={13}/> : <Plus size={13}/>}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {prospectos.length===0 && resultados===null && !buscando &&
        <EmptyState text="Toca una categoría para ver negocios de Bilbao automáticamente."/>}

      {/* Lista de prospectos guardados */}
      <div className="aa-clientlist">
        {grupos.map(({estado,list}) => (
          <div key={estado} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:ESTADO_COLOR[estado],letterSpacing:'0.08em',marginBottom:6,textTransform:'uppercase'}}>
              {ESTADO_LABEL[estado]} ({list.length})
            </div>
            {list.map(p => (
              <div key={p.id} className="aa-clientcard">
                <div className="aa-clientcard__top">
                  <span className="aa-clientcard__name">{p.nombre}</span>
                  {p.categoria && <span className="aa-tag aa-tag--gremio">{p.categoria}</span>}
                </div>
                {p.telefono && <div className="aa-clientcard__row"><span><Phone size={11} style={{verticalAlign:-1,marginRight:3}}/>{p.telefono}</span></div>}
                {p.notas    && <div className="aa-clientcard__sub" style={{fontSize:11,opacity:0.8}}>{p.notas}</div>}
                <div className="aa-leadactions" style={{marginTop:8,flexWrap:'wrap'}}>
                  {/* Con teléfono: WhatsApp + Llamar */}
                  {p.telefono && <>
                    <a href={waUrl(p.telefono)} target="_blank" rel="noopener noreferrer"
                      className="aa-addsmall aa-addsmall--brass" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
                      <MessageCircle size={13}/> WhatsApp
                    </a>
                    <a href={`tel:${p.telefono.replace(/\s/g,'')}`}
                      className="aa-addsmall" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
                      <Phone size={13}/> Llamar
                    </a>
                  </>}
                  {/* Sin teléfono: buscar + añadir inline */}
                  {!p.telefono && editandoTel !== p.id && <>
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(p.nombre+' Bilbao teléfono')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="aa-addsmall" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
                      <Search size={13}/> Buscar tel.
                    </a>
                    <button className="aa-addsmall" onClick={() => {setEditandoTel(p.id);setTelInput('')}}>
                      <Plus size={13}/> Añadir tel.
                    </button>
                  </>}
                  {/* Editor inline de teléfono */}
                  {editandoTel === p.id && (
                    <div style={{display:'flex',gap:4,width:'100%',marginTop:2}}>
                      <input type="tel" value={telInput} onChange={e => setTelInput(e.target.value)}
                        placeholder="946 123 456" autoFocus
                        style={{flex:1,padding:'4px 8px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,color:'#F2EEE4',fontSize:12,outline:'none'}}
                        onKeyDown={e => {
                          if(e.key==='Enter'&&telInput.trim()){onUpdate(p.id,{telefono:telInput.trim()});setEditandoTel(null)}
                          if(e.key==='Escape') setEditandoTel(null)
                        }}
                      />
                      <button className="aa-addsmall" style={{color:'#4CAF50',borderColor:'rgba(76,175,80,0.4)'}}
                        onClick={() => {if(telInput.trim()){onUpdate(p.id,{telefono:telInput.trim()});setEditandoTel(null)}}}>
                        <Check size={13}/>
                      </button>
                      <button className="aa-addsmall" onClick={() => setEditandoTel(null)}><X size={13}/></button>
                    </div>
                  )}
                  {/* Google Maps para ubicar */}
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(p.nombre+' Bilbao')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="aa-addsmall" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
                    <MapPin size={13}/> Maps
                  </a>
                  {p.estado==='pendiente'   && <button className="aa-addsmall" onClick={() => onUpdate(p.id,{estado:'contactado'})}>Marcar contactado</button>}
                  {p.estado==='contactado'  && <button className="aa-addsmall" style={{color:'#4CAF50',borderColor:'rgba(76,175,80,0.4)'}} onClick={() => onUpdate(p.id,{estado:'interesado'})}><Check size={13}/> Interesado</button>}
                  {p.estado!=='descartado'  && <button className="aa-addsmall" style={{color:'#E2625A',borderColor:'rgba(226,98,90,0.3)'}} onClick={() => onUpdate(p.id,{estado:'descartado'})}>Descartar</button>}
                  {p.estado==='descartado'  && <button className="aa-addsmall" onClick={() => onUpdate(p.id,{estado:'pendiente'})}>Recuperar</button>}
                  <DeleteButton onConfirm={() => onDelete(p.id)} label="prospecto"/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Formulario manual */}
      {showForm && (
        <div className="aa-overlay" onClick={() => setShowForm(false)}>
          <div className="aa-sheet" onClick={e => e.stopPropagation()}>
            <div className="aa-sheet__handle"/>
            <div className="aa-sheet__title">Nuevo prospecto</div>
            <label className="aa-label">Nombre del negocio</label>
            <input className="aa-input" value={form.nombre} onChange={e => sf('nombre',e.target.value)} placeholder="Ej. Bar Bilbao Centro"/>
            <label className="aa-label">Categoría</label>
            <input className="aa-input" list="aa-pc" value={form.categoria} onChange={e => sf('categoria',e.target.value)} placeholder="Restaurante, oficina…"/>
            <datalist id="aa-pc">{CATEGORIAS.map(c => <option key={c.label} value={c.label}/>)}</datalist>
            <label className="aa-label">Teléfono</label>
            <input className="aa-input" type="tel" value={form.telefono} onChange={e => sf('telefono',e.target.value)} placeholder="946 123 456"/>
            <label className="aa-label">Notas</label>
            <textarea className="aa-input aa-textarea" value={form.notas} onChange={e => sf('notas',e.target.value)} placeholder="Lo que te haya llamado la atención…"/>
            <button className="aa-submit aa-submit--brass" onClick={submit}>Guardar</button>
            <button className="aa-sheet__close" onClick={() => setShowForm(false)}><X size={16}/> Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
