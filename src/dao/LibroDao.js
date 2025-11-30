import pool from '../db/DB.js'


export async function getLibroById(id) {
  const sql = 'SELECT id_libro, nombre, genero, portada, pdf FROM Libro WHERE id_libro = ?'
  const [rows] = await pool.execute(sql, [id])
  const r = rows[0] || null
  if (r) {
    if (Buffer.isBuffer(r.portada)) r.portada = r.portada.toString('base64')
    if (Buffer.isBuffer(r.pdf)) r.pdf = r.pdf.toString('base64')
  }
  return r
}

export async function listLibros() {
  const sql = 'SELECT id_libro, nombre, genero, portada, pdf FROM Libro ORDER BY id_libro DESC'
  const [rows] = await pool.execute(sql)
  for (const r of rows) {
    if (Buffer.isBuffer(r.portada)) r.portada = r.portada.toString('base64')
    if (Buffer.isBuffer(r.pdf)) r.pdf = r.pdf.toString('base64')
  }
  return rows
}

//Busca libros por nombre
export async function searchLibros(nombre) {
  const sql = 'SELECT id_libro, nombre, genero, portada, pdf FROM Libro WHERE nombre LIKE ? ORDER BY id_libro DESC'
  const [rows] = await pool.execute(sql, [`%${nombre}%`])
  for (const r of rows) {
    if (Buffer.isBuffer(r.portada)) r.portada = r.portada.toString('base64')
    if (Buffer.isBuffer(r.pdf)) r.pdf = r.pdf.toString('base64')
  }
  return rows
}
