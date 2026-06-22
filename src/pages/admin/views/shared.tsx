import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Check, Trash2 } from 'lucide-react'

export function Stamp({children,tone='brass',small}:{children:ReactNode;tone?:string;small?:boolean}) {
  return <div className={`aa-stamp aa-stamp--${tone}${small?' aa-stamp--sm':''}`}>{children}</div>
}

export function DeleteButton({onConfirm,label=''}:{onConfirm:()=>void;label?:string}) {
  const [armed,setArmed] = useState(false)
  useEffect(()=>{if(!armed)return;const t=setTimeout(()=>setArmed(false),2500);return()=>clearTimeout(t)},[armed])
  if(armed) return <button className="aa-iconbtn aa-iconbtn--danger" onClick={()=>{setArmed(false);onConfirm()}}><Check size={15}/></button>
  return <button className="aa-iconbtn" onClick={()=>setArmed(true)} title={`Eliminar ${label}`}><Trash2 size={15}/></button>
}

export function EmptyState({text}:{text:string}){return <div className="aa-empty">{text}</div>}
