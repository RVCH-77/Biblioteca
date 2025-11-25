import pool from '../db/DB.js'


export async function getLibroById(id) {
  const sql = 'SELECT id_libro, nombre, genero, portada, pdf FROM Libro WHERE id_libro = ?'
  const [rows] = await pool.execute(sql, [id])
  return rows[0] || null
}

export async function listLibros() {
  const sql = 'SELECT id_libro, nombre, genero, portada, pdf FROM Libro ORDER BY id_libro DESC'
  const [rows] = await pool.execute(sql)
  return rows
}
