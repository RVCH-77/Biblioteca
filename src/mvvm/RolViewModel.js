// ViewModel cliente para Roles
export async function listRolesCqrs() {
  const r = await fetch('/roles')
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return await r.json()
}

export async function populateRolesSelect(selectEl) {
  const roles = await listRolesCqrs()
  const current = selectEl.value
  selectEl.innerHTML = '<option value="">Seleccionar Rol</option>'
  for(const rol of roles){
    const opt = document.createElement('option')
    opt.value = String(rol.id_rol)
    opt.textContent = rol.nombre
    selectEl.appendChild(opt)
  }
  if(current) selectEl.value = current
}

// Exportaciones por nombre; no se usa export default
