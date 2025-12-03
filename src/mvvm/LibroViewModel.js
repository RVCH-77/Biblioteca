const q = s => document.querySelector(s)

async function json(url, opts){
  const r = await fetch(url, opts)
  if(!r.ok) throw new Error('HTTP '+r.status)
  return r.headers.get('content-type')?.includes('application/json') ? r.json() : r.text()
}

// Convierte un valor a base64 si es necesario
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

async function load(){
  const data = await json('/libros')
  const tbody = q('#tablaLibros tbody')
  tbody.innerHTML = ''
  for(const l of data){
    const tr = document.createElement('tr')
    const portadaB64 = toBase64(l.portada)
    const mime = portadaB64.startsWith('/9j') ? 'image/jpeg' : (portadaB64.startsWith('iVBOR') ? 'image/png' : 'image/jpeg')
    const portadaCell = portadaB64 ? `<img class="portada-preview" src="data:${mime};base64,${portadaB64}" />` : ''
    const nombreConSufijo = l.nombre ? (l.nombre.endsWith(' (URV)') ? l.nombre : (l.nombre + ' (URV)')) : ''
    const pdfB64 = toBase64(l.pdf)
    const pdfLink = pdfB64 ? `<a href="data:application/pdf;base64,${pdfB64}" target="_blank">Ver PDF</a>` : ''
    tr.innerHTML = `<td>${l.id_libro||''}</td><td>${portadaCell}</td><td>${nombreConSufijo}</td><td>${l.genero||''}</td><td>${pdfLink}</td><td class="actions"><button data-id="${l.id_libro}" class="edit">Editar</button><button data-id="${l.id_libro}" class="delete">Eliminar</button></td>`
    tbody.appendChild(tr)
  }
}

async function submit(e){
  e.preventDefault()
  const id = q('#id_libro').value
  const fd = new FormData()
  {
    const nombreVal = q('#nombre').value
    const nombreFinal = nombreVal && !nombreVal.endsWith(' (URV)') ? (nombreVal + ' (URV)') : nombreVal
    fd.append('nombre', nombreFinal)
  }
  fd.append('genero', q('#genero').value)
  fd.append('universidad', q('#universidad').value)
  const portadaFile = q('#portada').files[0]
  const pdfFile = q('#pdf').files[0]
  if(id) fd.append('id_libro', id)
  if(portadaFile) fd.append('portada', portadaFile)
  if(pdfFile) fd.append('pdf', pdfFile)
  const method = id ? 'PUT' : 'POST'
  const r = await fetch('/libros', { method, body: fd })
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  q('#formLibro').reset()
  q('#id_libro').value = ''
  q('#portadaBase64').value = ''
  q('#pdfBase64').value = ''
  await load()
}

async function onTable(e){
  if(e.target.classList.contains('edit')){
    const id = e.target.dataset.id
    const l = await json('/libros/'+id)
    q('#id_libro').value = l.id_libro
    q('#nombre').value = l.nombre
    q('#genero').value = l.genero
    q('#universidad').value = l.universidad || ''
    q('#portadaBase64').value = toBase64(l.portada)
    q('#pdfBase64').value = toBase64(l.pdf)
  } else if(e.target.classList.contains('delete')){
    const id = e.target.dataset.id
    await json('/libros/'+id,{method:'DELETE'})
    await load()
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  q('#formLibro').addEventListener('submit', submit)
  q('#btnActualizar').addEventListener('click', async (e)=>{
    e.preventDefault()
    const id = q('#id_libro').value
    if(!id) return
    const fd = new FormData()
    fd.append('id_libro', id)
    {
      const nombreVal = q('#nombre').value
      const nombreFinal = nombreVal && !nombreVal.endsWith(' (URV)') ? (nombreVal + ' (URV)') : nombreVal
      fd.append('nombre', nombreFinal)
    }
    fd.append('genero', q('#genero').value)
    fd.append('universidad', q('#universidad').value)
    const portadaFile = q('#portada').files[0]
    const pdfFile = q('#pdf').files[0]
    if(portadaFile) fd.append('portada', portadaFile)
    if(pdfFile) fd.append('pdf', pdfFile)
    const r = await fetch('/libros', { method: 'PUT', body: fd })
    if(!r.ok){
      const msg = await r.text()
      throw new Error(msg || ('HTTP '+r.status))
    }
    q('#formLibro').reset()
    q('#id_libro').value = ''
    q('#portadaBase64').value = ''
    q('#pdfBase64').value = ''
    await load()
  })
  q('#tablaLibros').addEventListener('click', onTable)
  load()
})


