// Configuración centralizada de endpoints externos
export const EXTERNAL_ENDPOINTS = {
  listarLibros: 'https://7cc985afbc6f.ngrok-free.app/books/all', 
  listarLibros2: 'https://unillusioned-incompactly-kelsey.ngrok-free.dev/biblioteca_web/api/libros/buscar'
}

function baseFromEndpoint(){
  try{
    const u = new URL(EXTERNAL_ENDPOINTS.listarLibros || EXTERNAL_ENDPOINTS.listarLibros2)
    return u.origin
  }catch{ return '' }
}
const BASE_URL = baseFromEndpoint()

// Funcion para convertir url relativa a absoluta
function absoluteUrl(u){
  if(!u || typeof u !== 'string') return ''
  if(u.startsWith('http://') || u.startsWith('https://')) return u
  if(u.startsWith('/')) return BASE_URL + u
  return BASE_URL + '/' + u
}
// Funcion que me ayuda a ver si es una imagen base64 y pdf base64
function isImgBase64(s){
  return typeof s === 'string' && (s.startsWith('/9j') || s.startsWith('iVBOR') || s.startsWith('data:image'))
}
function isPdfBase64(s){
  return typeof s === 'string' && (s.startsWith('JVBER') || s.startsWith('data:application/pdf;base64,'))
}


// Funcion para lista de libros expterno
export async function listarLibros() {
  let all = []
  const fallbacks = [
    fetch('/externo/libros').catch(()=>null),
    fetch('/externo/libros_ngrok').catch(()=>null)
  ]
  const fr = await Promise.allSettled(fallbacks)
  for(const r of fr){
    if(r.status === 'fulfilled' && r.value && r.value.ok){
      try{ all = all.concat(await r.value.json()) }catch{}
    }
  }
  if(all.length) return all
  const headers = { 'ngrok-skip-browser-warning': 'true' }
  const reqs = [
    fetch(EXTERNAL_ENDPOINTS.listarLibros, { headers }).catch(()=>null),
    fetch(EXTERNAL_ENDPOINTS.listarLibros2, { headers }).catch(()=>null)
  ]
  const res = await Promise.allSettled(reqs)
  for(const r of res){
    if(r.status === 'fulfilled' && r.value && r.value.ok){
      try{ all = all.concat(await r.value.json()) }catch{}
    }
  }
  return all
}

 
//  el formato de libros externos a la estructura 
export function normalizarLibrosExternos(lista) {
  if(!Array.isArray(lista)) return []
  return lista.map((e, idx)=>({
    id_libro: e.id_libro || e.id || (`ext-${idx}`),
    nombre: e.nombre || e.titulo || e.title || 'Sin título',
    genero: e.genero || e.categoria || e.category || '',
    portada: isImgBase64(e.portada) ? e.portada : null,
    pdf: isPdfBase64(e.pdf) ? (e.pdf.startsWith('data:') ? e.pdf.replace('data:application/pdf;base64,','') : e.pdf) : null,
    _imgUrl: absoluteUrl(e.portadaUrl || e.portada_url || (!isImgBase64(e.portada) ? e.portada : '') || e.imagen || e.imageUrl || e.img || ''),
    _pdfUrl: absoluteUrl(e.pdfUrl || e.pdf_url || (!isPdfBase64(e.pdf) ? e.pdf : '') || e.archivo || e.fileUrl || ''),
    _externo: true
  }))
}

// Carga y normaliza en una sola llamada
export async function cargarLibrosExternos(){
  const raw = await listarLibros()  
  return normalizarLibrosExternos(raw)
}
// carga y normaliza en una sola llamada
export async function cargarLibrosExternos2(){
  const raw = await listarLibros2()  
  return normalizarLibrosExternos(raw)
}

// Busca autor y año por título desde el backend
export async function buscarInfoPorTitulo(title){
  try{
    const endpoint = `${EXTERNAL_ENDPOINTS.buscarInfoPorTitulo}?title=${encodeURIComponent(title || '')}`
    const r = await fetch(endpoint)
    if(!r.ok) throw new Error('HTTP '+r.status)
    const data = await r.json()
    const doc = data?.docs?.[0]
    return { autor: doc?.author_name?.[0] || '—', year: doc?.first_publish_year || '—' }
  }catch{ return { autor:'—', year:'—' } }
}
