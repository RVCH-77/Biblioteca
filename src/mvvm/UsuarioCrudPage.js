import { createUsuario, updateUsuario, deleteUsuario, listUsuarios, getUsuarioById } from '/mvvm/UsuarioViewModel.js'
import { populateRolesSelect } from '/mvvm/RolViewModel.js'

const q = s => document.querySelector(s)

async function load(){
  const data = await listUsuarios()
  const tbody = q('#tablaUsuarios tbody')
  tbody.innerHTML = ''
  for(const u of data){
    const tr = document.createElement('tr')
    const pass = u.contrasena || ''
    tr.innerHTML = `<td>${u.id_usuario||''}</td><td>${u.nombre||''}</td><td>${pass}</td><td>${u.id_rol_fk||''}</td><td class="actions"><button data-id="${u.id_usuario}" class="edit">Editar</button><button data-id="${u.id_usuario}" class="delete">Eliminar</button></td>`
    tbody.appendChild(tr)
  }
}

async function submit(e){
  e.preventDefault()
  const id = q('#id_usuario').value
  const usuario = { nombre: q('#u_nombre').value, contrasena: q('#u_contrasena').value, id_rol_fk: Number(q('#id_rol_fk').value) }
  if(id){ await updateUsuario(id, usuario) } else { await createUsuario(usuario) }
  q('#formUsuario').reset()
  q('#id_usuario').value = ''
  await load()
}

async function onTable(e){
  if(e.target.classList.contains('edit')){
    const id = e.target.dataset.id
    const u = await getUsuarioById(id)
    q('#id_usuario').value = u.id_usuario||''
    q('#u_nombre').value = u.nombre||''
    q('#u_contrasena').value = u.contrasena||''
    q('#id_rol_fk').value = u.id_rol_fk||''
  } else if(e.target.classList.contains('delete')){
    const id = e.target.dataset.id
    await deleteUsuario(id)
    await load()
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  q('#formUsuario').addEventListener('submit', submit)
  q('#btnActualizarUsuario').addEventListener('click', async (e)=>{
    e.preventDefault()
    const id = q('#id_usuario').value
    if(!id) return
    const usuario = { nombre: q('#u_nombre').value, contrasena: q('#u_contrasena').value, id_rol_fk: Number(q('#id_rol_fk').value) }
    await updateUsuario(id, usuario)
    q('#formUsuario').reset()
    q('#id_usuario').value = ''
    await load()
  })
  q('#tablaUsuarios').addEventListener('click', onTable)
  populateRolesSelect(q('#id_rol_fk'))
  load()
})

