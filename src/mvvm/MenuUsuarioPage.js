
function toBase64(v){
  if (typeof v === 'string') return v
  if (v && Array.isArray(v?.data)){
    const bytes = new Uint8Array(v.data)
    let binary = ''
    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk){
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
    }
    return btoa(binary)
  }
  return ''
}

async function json(url){
  const r = await fetch(url)
  if(!r.ok) throw new Error('HTTP '+r.status)
  return r.json()
}

const q = s => document.querySelector(s)
const grid = q('#gridLibros')
const d_titulo = q('#d_titulo')
const d_genero = q('#d_genero')
const d_autor = q('#d_autor')
const d_year = q('#d_year')
const btnPdf = q('#btnAbrirPdf')
const btnInfo = q('#btnBuscarInfo')
const btnLogout = q('#btnLogout')
const filtroOrigen = q('#filtroOrigen')
const searchInput = q('#searchLibro')

let currentLibro = null
let externalLoaded = false
let librosLocalesCache = []
let librosExternosCache = []
let combinadosCache = []
let searchQuery = ''

function keyOf(libro){
  return String(libro?.nombre||'').toLowerCase().trim()
}

function renderCard(libro){
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220"><rect width="100%" height="100%" fill="%23eeeeee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999999" font-family="Segoe UI, Arial" font-size="14">Sin imagen</text></svg>'
  const portadaStr = typeof libro.portada === 'string' ? libro.portada : ''
  const isDataUrl = portadaStr.startsWith('data:')
  const portadaB64 = isDataUrl ? '' : toBase64(libro.portada)
  const mime = portadaB64.startsWith('/9j') ? 'image/jpeg' : (portadaB64.startsWith('iVBOR') ? 'image/png' : 'image/jpeg')
  const imgSrc = isDataUrl ? portadaStr : (portadaB64 ? `data:${mime};base64,${portadaB64}` : (libro._imgUrl || placeholder))
  const card = document.createElement('div')
  card.className = 'card'
  card.innerHTML = `
    <img class="cover" src="${imgSrc}" alt="${libro.nombre||''}">
    <div class="card-body">
      <div class="title">${libro.nombre||''}</div>
      <div class="genre">${libro.genero||''}</div>
    </div>`
  const imgEl = card.querySelector('.cover')
  imgEl.addEventListener('error', ()=>{ imgEl.src = placeholder })
  if(libro._externo){
    const badge = document.createElement('div')
    badge.className = 'badge'
    badge.textContent = 'Externo'
    card.appendChild(badge)
  }
  card.addEventListener('click', ()=> openLibro(libro))
  return card
}
// La obtención de autor/año se centraliza en ApiExterna

function openLibro(libro){
  currentLibro = libro
  d_titulo.textContent = libro.nombre || '—'
  d_genero.textContent = libro.genero || '—'
  btnPdf.disabled = !(toBase64(libro.pdf) || libro._pdfUrl)
  btnInfo.disabled = false
}

btnPdf.addEventListener('click', ()=>{
  if(!currentLibro) return
  const pdfB64 = toBase64(currentLibro.pdf)
  if(pdfB64){
    const url = `data:application/pdf;base64,${pdfB64}`
    window.open(url, '_blank')
    return
  }
  if(currentLibro._pdfUrl){
    window.open(currentLibro._pdfUrl, '_blank')
    return
  }
  alert('Este libro no tiene PDF adjunto')
})



btnInfo.addEventListener('click', async ()=>{
  if(!currentLibro) return
  const info = await buscarInfoPorTitulo(currentLibro.nombre||'')
  d_autor.textContent = info.autor
  d_year.textContent = info.year
})

function renderList(arr){
  grid.innerHTML = ''
  const q = searchQuery.toLowerCase()
  const filtered = q ? arr.filter(l => String(l?.nombre||'').toLowerCase().includes(q) || String(l?.genero||'').toLowerCase().includes(q)) : arr
  if(!filtered.length){
    const empty = document.createElement('div')
    empty.className = 'empty-state'
    empty.innerHTML = '<p>No hay libros para mostrar</p>'
    grid.appendChild(empty)
    return
  }
  for(const l of filtered){ grid.appendChild(renderCard(l)) }
}

function applyFilter(){
  const v = filtroOrigen?.value || 'todos'
  if(v === 'locales') return renderList(librosLocalesCache)
  if(v === 'externos'){
    const keysLocales = new Set(librosLocalesCache.map(keyOf))
    return renderList(librosExternosCache.filter(e=>!keysLocales.has(keyOf(e))))
  }
  renderList(combinadosCache)
}

async function load(){
  try{
    const [librosLocales, librosExternosRaw] = await Promise.all([
      json('/libros'),
      cargarLibrosExternos().catch(()=>[])
    ])
    librosLocalesCache = Array.isArray(librosLocales) ? librosLocales : []
    librosExternosCache = Array.isArray(librosExternosRaw) ? librosExternosRaw : []
    externalLoaded = librosExternosCache.length > 0
    const map = new Map()
    for(const l of librosLocalesCache){
      map.set(keyOf(l), l)
    }
    for(const e of librosExternosCache){
      const k = keyOf(e)
      const ex = map.get(k)
      if(ex){
        if(!toBase64(ex.portada) && e._imgUrl) ex._imgUrl = e._imgUrl
        if(!toBase64(ex.pdf) && e._pdfUrl) ex._pdfUrl = e._pdfUrl
        if(!ex.genero && e.genero) ex.genero = e.genero
      }else{
        map.set(k, e)
      }
    }
    combinadosCache = Array.from(map.values())
  }catch{
    librosLocalesCache = []
    librosExternosCache = []
    combinadosCache = []
  }
  applyFilter()
}

document.addEventListener('DOMContentLoaded', ()=>{
  const session = localStorage.getItem('session_user')
  if(!session){ location.href = '/mvp/Login.html'; return }
  btnLogout?.addEventListener('click', ()=>{
    localStorage.removeItem('session_user')
    location.href = '/mvp/Login.html'
  })
  filtroOrigen?.addEventListener('change', applyFilter)
  searchInput?.addEventListener('input', (e)=>{ searchQuery = String(e.target.value||'').trim(); applyFilter() })
  load()
})
import { cargarLibrosExternos, buscarInfoPorTitulo } from '/ddd/ApiExterna.js'
