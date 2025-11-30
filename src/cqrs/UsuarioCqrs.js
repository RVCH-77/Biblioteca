import pool from '../db/DB.js'

// Insertar un usuario
export async function insertUsuario(usuario) {
  const query = 'INSERT INTO Usuario (nombre, contrasena, id_rol_fk) VALUES (?, ?, ?)'
  const [result] = await pool.execute(query, [usuario.nombre, usuario.contrasena, usuario.id_rol_fk])
  return result.insertId
}

export async function updateUsuario(usuario) {
  const query = 'UPDATE Usuario SET nombre = ?, contrasena = ?, id_rol_fk = ? WHERE id_usuario = ?'
  const [result] = await pool.execute(query, [usuario.nombre, usuario.contrasena, usuario.id_rol_fk, usuario.id_usuario])
  return result.affectedRows > 0
}

export async function deleteUsuario(id) {
  const query = 'DELETE FROM Usuario WHERE id_usuario = ?'
  const [result] = await pool.execute(query, [id])
  return result.affectedRows > 0
}
