import { insertLibro } from '../cqrs/LibroCqrs.js'
import { getLibroById } from '../dao/LibroDao.js'
import { listLibros } from '../dao/LibroDao.js'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { updateLibro } from '../cqrs/LibroCqrs.js'
import { deleteLibro } from '../cqrs/LibroCqrs.js'

function isBufferLike(v){
  return Buffer.isBuffer(v) || (v && typeof v === 'object' && Array.isArray(v.data))
}

async function ensureBase64(v){
  if (!v) return ''
  if (Buffer.isBuffer(v)) return v.toString('base64')
  if (v && typeof v === 'object' && Array.isArray(v.data)) return Buffer.from(v.data).toString('base64')
  if (typeof v === 'string'){
    if (v.startsWith('/uploads/')){
      try{
        const filePath = join(process.cwd(), v.replace(/^\//, ''))
        const buf = await readFile(filePath)
        return buf.toString('base64')
      }catch{
        return ''
      }
    }
    return v
  }
  return ''
}

async function insertLibroController(req, res) {
  const body = req.body || {}
  const nombre = body.nombre
  const genero = body.genero
  if (!nombre || !genero) { res.status(400).json({ error: 'nombre y genero requeridos' }); return }
  const portadaFile = req.files?.portada?.[0]
  const pdfFile = req.files?.pdf?.[0]
  const portadaBase64 = body.portadaBase64
  const pdfBase64 = body.pdfBase64
  const portada = portadaFile ? portadaFile.buffer : (typeof portadaBase64 === 'string' ? Buffer.from(portadaBase64, 'base64') : Buffer.alloc(0))
  const pdf = pdfFile ? pdfFile.buffer : (typeof pdfBase64 === 'string' ? Buffer.from(pdfBase64, 'base64') : Buffer.alloc(0))
  try {
    const nombreFinal = typeof nombre === 'string' ? (nombre.endsWith(' (URV)') ? nombre : (nombre + ' (URV)')) : nombre
    const id = await insertLibro({ nombre: nombreFinal, genero, portada, pdf })
    res.status(201).json({ id })
  } catch (error) {
    console.error('insertLibroController error:', error)
    res.status(500).json({ error: error?.message || String(error), code: error?.code || undefined })
  }
}

async function updateLibroController(req, res) {
  const body = req.body || {}
  const id_libro = body.id_libro
  const nombre = body.nombre
  const genero = body.genero
  const portadaBase64 = body.portadaBase64
  const pdfBase64 = body.pdfBase64
  if (!id_libro || !nombre || !genero) { res.status(400).json({ error: 'id_libro, nombre y genero requeridos' }); return }
  const portadaFile = req.files?.portada?.[0]
  const pdfFile = req.files?.pdf?.[0]
  let portada = portadaFile ? portadaFile.buffer : (typeof portadaBase64 === 'string' ? Buffer.from(portadaBase64, 'base64') : undefined)
  let pdf = pdfFile ? pdfFile.buffer : (typeof pdfBase64 === 'string' ? Buffer.from(pdfBase64, 'base64') : undefined)
  try {
    if (portada === undefined || pdf === undefined) {
      const existing = await getLibroById(id_libro)
      if (!existing) { res.status(404).json({ error: 'Libro no encontrado' }); return }
      if (portada === undefined) {
        const v = existing.portada
        portada = Buffer.isBuffer(v) ? v : (typeof v === 'string' ? Buffer.from(v, 'base64') : Buffer.alloc(0))
      }
      if (pdf === undefined) {
        const v = existing.pdf
        pdf = Buffer.isBuffer(v) ? v : (typeof v === 'string' ? Buffer.from(v, 'base64') : Buffer.alloc(0))
      }
    }
    if (portada == null) portada = Buffer.alloc(0)
    if (pdf == null) pdf = Buffer.alloc(0)
    const success = await updateLibro({ id_libro, nombre, genero, portada, pdf })
    if (success) {
      res.status(200).json({ message: 'Libro actualizado correctamente' })
    } else {
      res.status(404).json({ error: 'Libro no encontrado' })
    }
  } catch (error) {
    console.error('updateLibroController error:', error)
    res.status(500).json({ error: error?.message || String(error), code: error?.code || undefined })
  }
}

async function getLibroByIdController(req, res) {
  const { id } = req.params
  try {
    const libro = await getLibroById(id)
    if (libro) {
      libro.portada = await ensureBase64(libro.portada)
      libro.pdf = await ensureBase64(libro.pdf)
      res.status(200).json(libro)
    } else {
      res.status(404).json({ error: 'Libro no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el libro' })
  }
}

async function listLibrosController(req, res) {
  try {
    const qn = (req.query?.nombre || '').toLowerCase()
    const all = await listLibros()
    const libros = qn ? all.filter(l => (l.nombre || '').toLowerCase().includes(qn)) : all
    for (const libro of libros) {
      libro.portada = await ensureBase64(libro.portada)
      libro.pdf = await ensureBase64(libro.pdf)
    }
    res.status(200).json(libros)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los libros' })
  }
}

export {
  insertLibroController,
  updateLibroController,
  getLibroByIdController,
  listLibrosController,
  deleteLibroController,
  searchLibrosController
  
}

async function deleteLibroController(req, res) {
  const { id } = req.params
  try {
    const success = await deleteLibro(id)
    if (success) {
      res.status(200).json({ message: 'Libro eliminado' })
    } else {
      res.status(404).json({ error: 'Libro no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el libro' })
  }
}

//Busca libros por nombre
async function searchLibrosController(req, res) {
  const nombre = (req.params?.nombre || req.query?.nombre || '').toLowerCase()
  try {
    const todos = await listLibros()
    const libros = todos.filter(l => (l.nombre || '').toLowerCase().includes(nombre))
    for (const libro of libros) {
      libro.portada = await ensureBase64(libro.portada)
      libro.pdf = await ensureBase64(libro.pdf)
    }
    res.status(200).json(libros)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar los libros' })
  }
}
