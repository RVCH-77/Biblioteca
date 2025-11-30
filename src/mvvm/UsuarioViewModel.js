
// ViewModel para Usuarios

// Métodos para interactuar con la API de Usuarios
export async function createUsuario(usuario) {
  const r = await fetch('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  })
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return await r.json()
}

// Actualizar un usuario
export async function updateUsuario(id, usuario) {
  const r = await fetch('/usuarios/'+id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  })
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return await r.json()
}

// Eliminar un usuario
export async function deleteUsuario(id) {
  const r = await fetch('/usuarios/'+id, {
    method: 'DELETE'
  })
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return await r.json()
}

// Listar todos los usuarios
export async function listUsuarios() {
  const r = await fetch('/usuarios')
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return await r.json()
}

// Ver usuario por id
export async function getUsuarioById(id) {
  const r = await fetch('/usuarios/'+id)
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return await r.json()
}

// Ver usuario por nombre
export async function getUsuarioByNombre(nombre) {
  const r = await fetch('/usuarios/'+nombre)
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return await r.json()
}

