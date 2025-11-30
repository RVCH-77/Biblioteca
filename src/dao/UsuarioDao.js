
//Ver usuario por id
export async function getUsuarioById(id) {
  const sql = 'SELECT id_usuario, nombre, contrasena, id_rol_fk FROM Usuario WHERE id_usuario = ?'
  const [rows] = await pool.execute(sql, [id])
  return rows[0] || null
}
export async function getUsuarioByNombre(nombre) {
  const sql = 'SELECT id_usuario, nombre, contrasena, id_rol_fk FROM Usuario WHERE nombre = ?'
  const [rows] = await pool.execute(sql, [nombre])
  return rows[0] || null
}

//Listar todos los usuarios
export async function listUsuarios() {
  const sql = 'SELECT id_usuario, nombre, contrasena, id_rol_fk FROM Usuario'
  const [rows] = await pool.execute(sql)
  return rows
}
import pool from '../db/DB.js'
