export interface Cliente { id:string; nombre:string; telefono:string; direccion:string; frecuencia:string; notas:string }
export interface Visita { id:string; clienteId:string; fecha:string; hora:string; tipo:string; direccion:string; notas:string; estado:string; _type?:string }
export interface Cobro { id:string; clienteId:string; fecha:string; hora:string; importe:number; metodo:string; estado:string; _type?:string }
export interface Tarea { id:string; descripcion:string; fecha:string; completada:boolean }
export interface Empleado { id:string; nombre:string; telefono:string; tipoPago:'hora'|'dia'|'fijo'; tarifa:number }
export interface Pago { id:string; empleadoId:string; fecha:string; importe:number; concepto:string }
export interface Jornada { id:string; empleadoId:string; fecha:string; pagado:boolean }
export interface Obra { id:string; nombre:string; cliente:string; direccion:string; estado:string; fechaInicio:string; notas:string }
export interface ObraItem { id:string; obraId:string; descripcion:string; gremio:string; completado:boolean }
export interface Asignacion { id:string; obraId:string; empleadoId:string; fecha:string; notas:string }
export interface Lead { id:string; nombre:string; telefono:string; gremio:string; mensaje:string; estado:'nuevo'|'contactado'|'convertido'|'descartado'; fecha:string }
export interface Presupuesto { id:string; clienteId:string; nombre:string; estado:string; fecha:string; notas:string; iva:boolean }
export interface PresupuestoLinea { id:string; presupuestoId:string; concepto:string; gremio:string; cantidad:number; unidad:string; precioUnitario:number }
export interface CatalogoItem { concepto:string; gremio:string; unidad:string; ultimoPrecio:number; promedio:number; vecesUsado:number; ultimaFecha:string }
export interface Factura { id:string; numero:string; clienteId:string; fecha:string; concepto:string; total:number; iva:boolean; estado:'pendiente'|'cobrada'; notas:string }

export const GREMIOS_SUGERIDOS = ['Albañilería','Electricidad','Fontanería','Pintura','Carpintería','Climatización','Cerrajería','Solados','Pladur / Yesos']
export const ESTADOS_OBRA = ['En curso','Pausada','Terminada']
export const ESTADOS_PRESUPUESTO = ['Borrador','Enviado','Aceptado','Rechazado']
export const UNIDADES = ['ud','m²','m','h','global']
