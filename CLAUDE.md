# Multiservicios Provenza — Notas del proyecto

## URLs
- **Producción (Vercel):** https://multiservicios-provenza-jwgrzmk2j.vercel.app/
- **Rama de desarrollo:** `claude/funny-volta-i0kbds`
- **Rama de producción:** `main` (Vercel despliega desde aquí)

## Flujo de despliegue
Cada cambio debe pushearse a `claude/funny-volta-i0kbds` y luego mergearse a `main`:
```
git push -u origin claude/funny-volta-i0kbds
git checkout main && git merge claude/funny-volta-i0kbds --no-edit && git push -u origin main
git checkout claude/funny-volta-i0kbds
```

## Contacto del negocio
- **Empresa:** Multiservicios Provenza
- **Teléfono:** +34 624 118 284 (WhatsApp: 34624118284)
- **Email:** inforeformasmiribilla@gmail.com
- **Zona:** Gran Bilbao (Bizkaia)
- **Fundada:** 2009
- **Registro:** BI-2009-1284 · Registro de Empresas Instaladoras de Bizkaia

## Stack técnico
- React 19 + TypeScript + Vite + Tailwind CSS v4
- Fuentes: Instrument Serif + Inter (Google Fonts)
- Sin backend — los formularios envían por WhatsApp (`wa.me`)
- Panel de administración en `/admin`
- Datos del panel en localStorage (`provenza_panel_*`) + Supabase (`panel_data`)

## Pendiente para próximas sesiones
- Dominio propio (ej. `multiservicios-provenza.es`)
- Google Ads — campaña local Bilbao
- Google My Business — ficha de empresa
- Integraciones de software adicionales (pendiente de definir)
