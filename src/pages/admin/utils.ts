const pad = (n: number) => String(n).padStart(2, '0')
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
const parseISODate = (s: string) => { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d) }
export const addDays = (s: string, n: number) => { const d = parseISODate(s); d.setDate(d.getDate()+n); return toISODate(d) }
export const todayISO = () => toISODate(new Date())
const startOfWeek = (s: string) => { const d = parseISODate(s); const day = d.getDay(); const diff = day===0?-6:1-day; d.setDate(d.getDate()+diff); return toISODate(d) }
export const weekDaysOf = (s: string) => { const start = startOfWeek(s); return Array.from({length:7},(_,i)=>addDays(start,i)) }
export const dayLabel = (s: string) => { const d = parseISODate(s); const t = d.toLocaleDateString('es-ES',{weekday:'short'}).replace('.',''); return t.charAt(0).toUpperCase()+t.slice(1) }
export const dayNum = (s: string) => parseISODate(s).getDate()
export const longLabel = (s: string) => { const d = parseISODate(s); const t = d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}); return t.charAt(0).toUpperCase()+t.slice(1) }
export const daysAgo = (s: string) => Math.round((parseISODate(todayISO()).getTime()-parseISODate(s).getTime())/86400000)
export const monthKey = (s: string) => s.slice(0,7)
export const uid = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2)
export const fmt = (n: number|string) => Number(n).toLocaleString('es-ES',{minimumFractionDigits:2})
export const waLink = (telefono: string, mensaje: string) => { let n=(telefono||'').replace(/\D/g,''); if(n.length===9) n='34'+n; return `https://wa.me/${n}?text=${encodeURIComponent(mensaje)}` }
