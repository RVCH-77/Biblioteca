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

let currentLibro = null

function renderCard(libro){
  const portadaB64 = toBase64(libro.portada)
  const mime = portadaB64.startsWith('/9j') ? 'image/jpeg' : (portadaB64.startsWith('iVBOR') ? 'image/png' : 'image/jpeg')
  const imgSrc = portadaB64 ? `data:${mime};base64,${portadaB64}` : ''
  const card = document.createElement('div')
  card.className = 'card'
  card.innerHTML = `
    <img class="cover" src="${imgSrc}" alt="${libro.nombre||''}">
    <div class="card-body">
      <div class="title">${libro.nombre||''}</div>
      <div class="genre">${libro.genero||''}</div>
    </div>`
  card.addEventListener('click', ()=> openLibro(libro))
  return card
}

function openLibro(libro){
  currentLibro = libro
  d_titulo.textContent = libro.nombre || '—'
  d_genero.textContent = libro.genero || '—'
  btnPdf.disabled = false
  btnInfo.disabled = false
}

btnPdf.addEventListener('click', ()=>{
  if(!currentLibro) return
  const pdfB64 = toBase64(currentLibro.pdf)
  if(!pdfB64){ alert('Este libro no tiene PDF adjunto') ; return }
  const url = `data:application/pdf;base64,${pdfB64}`
  window.open(url, '_blank')
})

async function fetchExternalInfoByTitle(title){
  try{
    const endpoint = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    const r = await fetch(endpoint)
    if(!r.ok) throw new Error('HTTP '+r.status)
    const data = await r.json()
    const doc = data?.docs?.[0]
    return { autor: doc?.author_name?.[0] || '—', year: doc?.first_publish_year || '—' }
  }catch{ return { autor:'—', year:'—' } }
}

btnInfo.addEventListener('click', async ()=>{
  if(!currentLibro) return
  const info = await fetchExternalInfoByTitle(currentLibro.nombre||'')
  d_autor.textContent = info.autor
  d_year.textContent = info.year
})

async function load(){
  const libros = await json('/libros')
  grid.innerHTML = ''
  for(const l of libros){
    grid.appendChild(renderCard(l))
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const session = localStorage.getItem('session_user')
  if(!session){ location.href = '/mvp/Login.html'; return }
  btnLogout?.addEventListener('click', ()=>{
    localStorage.removeItem('session_user')
    location.href = '/mvp/Login.html'
  })
  load()
})
