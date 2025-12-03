
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
export async function listUsuariosCqrs() {
  const sql = 'SELECT id_usuario, nombre, contrasena, id_rol_fk FROM Usuario'
  const [rows] = await pool.execute(sql)
  return rows
}
import pool from '../db/DB.js'

// Insertar un usuario
export async function insertUsuarioCqrs(usuario) {
  const query = 'INSERT INTO Usuario (nombre, contrasena, id_rol_fk) VALUES (?, ?, ?)'
  const [result] = await pool.execute(query, [usuario.nombre, usuario.contrasena, usuario.id_rol_fk])
  return result.insertId
}

export async function updateUsuarioCqrs(usuario) {
  const query = 'UPDATE Usuario SET nombre = ?, contrasena = ?, id_rol_fk = ? WHERE id_usuario = ?'
  const [result] = await pool.execute(query, [usuario.nombre, usuario.contrasena, usuario.id_rol_fk, usuario.id_usuario])
  return result.affectedRows > 0
}

export async function deleteUsuario(id) {
  const query = 'DELETE FROM Usuario WHERE id_usuario = ?'
  const [result] = await pool.execute(query, [id])
  return result.affectedRows > 0
}
