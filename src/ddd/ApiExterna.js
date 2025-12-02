// Configuración centralizada de endpoints externos
export const EXTERNAL_ENDPOINTS = {
  listarLibros: 'http://localhost:8080/biblioteca_web/api/libros/buscar'
}

const BASE_URL = 'http://localhost:8080'

// Funcion para convertir url relativa a absoluta
function absoluteUrl(u){
  if(!u || typeof u !== 'string') return ''
  if(u.startsWith('http://') || u.startsWith('https://')) return u
  if(u.startsWith('/')) return BASE_URL + u
  return BASE_URL + '/' + u
}
// Funcion que me ayuda a ver si es una imagen base64
function isImgBase64(s){
  return typeof s === 'string' && (s.startsWith('/9j') || s.startsWith('iVBOR') || s.startsWith('data:image'))
}
function isPdfBase64(s){
  return typeof s === 'string' && (s.startsWith('JVBER') || s.startsWith('data:application/pdf;base64,'))
}


// Funcion para lista de libros expterno
export async function listarLibros() {
  try{
    const r = await fetch(EXTERNAL_ENDPOINTS.listarLibros)
    if(!r.ok) throw new Error('HTTP '+r.status)
    return await r.json()
  }catch(err){
    try{
      const rp = await fetch('/externo/libros')
      if(!rp.ok) throw new Error('HTTP '+rp.status)
      return await rp.json()
    }catch(err2){
      return []
    }
  }
}

// Normaliza el formato de libros externos a la estructura usada en el cliente
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

// Busca autor y año por título desde OpenLibrary
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
