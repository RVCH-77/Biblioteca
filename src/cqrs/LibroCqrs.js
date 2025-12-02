import pool from '../db/DB.js'

export async function insertLibro(libro) {
  const sql = 'INSERT INTO Libro (nombre, genero, universidad, portada, pdf) VALUES (?, ?, ?, ?, ?)'
  const [result] = await pool.execute(sql, [libro.nombre, libro.genero, libro.universidad ?? null, libro.portada, libro.pdf])
  return result.insertId
}

export async function updateLibro(libro) {
  const sql = 'UPDATE Libro SET nombre = ?, genero = ?, universidad = ?, portada = ?, pdf = ? WHERE id_libro = ?'
  const [result] = await pool.execute(sql, [libro.nombre, libro.genero, libro.universidad ?? null, libro.portada, libro.pdf, libro.id_libro])
  return result.affectedRows > 0
}

export async function deleteLibro(id) {
  const sql = 'DELETE FROM Libro WHERE id_libro = ?'
  const [result] = await pool.execute(sql, [id])
  return result.affectedRows > 0
}
