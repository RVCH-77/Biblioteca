import { insertUsuarioCqrs, updateUsuarioCqrs, deleteUsuarioCqrs } from '../cqrs/UsuarioCqrs.js'
import { listUsuariosCqrs, getUsuarioByIdCqrs } from '../dao/UsuarioDao.js'
import { searchUsuariosCqrs } from '../dao/UsuarioDao.js'



async function insertUsuarioController(req, res) {
  const body = req.body || {}
  const nombre = body.nombre
  const contrasena = body.contrasena
  const id_rol_fk = body.id_rol_fk
  if (!nombre || !contrasena || !id_rol_fk) { res.status(400).json({ error: 'nombre, contrasena e id_rol_fk requeridos' }); return }
  try {
    const id = await insertUsuarioCqrs({ nombre, contrasena, id_rol_fk })
    res.status(201).json({ id })
  } catch (error) {
    res.status(500).json({ error: error?.message || String(error), code: error?.code || undefined })
  }
}

async function updateUsuarioController(req, res) {
  const { id } = req.params
  const body = req.body || {}
  const nombre = body.nombre
  const contrasena = body.contrasena
  const id_rol_fk = body.id_rol_fk
  if (!id || !nombre || !contrasena || !id_rol_fk) { res.status(400).json({ error: 'id, nombre, contrasena e id_rol_fk requeridos' }); return }
  try {
    const ok = await updateUsuarioCqrs({ id_usuario: id, nombre, contrasena, id_rol_fk })
    if (ok) res.status(200).json({ message: 'Usuario actualizado' })
    else res.status(404).json({ error: 'Usuario no encontrado' })
  } catch (error) {
    res.status(500).json({ error: error?.message || String(error), code: error?.code || undefined })
  }
}

async function deleteUsuarioController(req, res) {
  const { id } = req.params
  try {
    const ok = await deleteUsuarioCqrs(id)
    if (ok) res.status(200).json({ message: 'Usuario eliminado' })
    else res.status(404).json({ error: 'Usuario no encontrado' })
  } catch (error) {
    res.status(500).json({ error: error?.message || String(error), code: error?.code || undefined })
  }
}

async function listUsuariosController(req, res) {
  try {
    const usuarios = await listUsuariosCqrs()
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar usuarios' })
  }
}

async function getUsuarioByIdController(req, res) {
  const { id } = req.params
  try {
    const u = await getUsuarioById(id)
    if (u) res.status(200).json(u)
    else res.status(404).json({ error: 'Usuario no encontrado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
}

export {
  insertUsuarioController,
  updateUsuarioController,
  deleteUsuarioController,
  listUsuariosController,
  getUsuarioByIdController
}
