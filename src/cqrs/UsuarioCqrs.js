import { insertUsuario, updateUsuario, deleteUsuario, getUsuarioById, getUsuarios, getUsuariosByRol, getUsuarioByNombre, getUsuarioByNombreAndContrasena, getUsuariosByNombre, getUsuariosByRolAndNombre } from '../dao/UsuarioDao.js'
// CQRS para Usuario
export async function insertUsuarioCqrs(usuario) {
  return insertUsuario(usuario) 
}   
export async function updateUsuarioCqrs(usuario) {
  return updateUsuario(usuario)
}
export async function deleteUsuarioCqrs(id) {
  return deleteUsuario(id)
}
export async function getUsuarioByIdCqrs(id) {
  return getUsuarioById(id)
}
export async function getUsuariosCqrs() {
  return getUsuarios()
}
export async function getUsuariosByRolCqrs(rol) {
  return getUsuariosByRol(rol)
}
export async function getUsuarioByNombreCqrs(nombre) {
  return getUsuarioByNombre(nombre)
}
export async function getUsuarioByNombreAndContrasenaCqrs(nombre, contrasena) {
  return getUsuarioByNombreAndContrasena(nombre, contrasena)
}
export async function getUsuariosByNombreCqrs(nombre) {
  return getUsuariosByNombre(nombre)
}
export async function getUsuariosByRolAndNombreCqrs(rol, nombre) {
  return getUsuariosByRolAndNombre(rol, nombre)
}






