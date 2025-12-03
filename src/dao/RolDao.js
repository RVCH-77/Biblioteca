import pool from '../db/DB.js'

//Lista de roles
export async function listRoles() {
  const sql = 'SELECT id_rol, nombre FROM Rol'
  const [rows] = await pool.execute(sql)
  return rows
}
