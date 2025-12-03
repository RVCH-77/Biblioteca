
import { readFile } from 'fs/promises'
import { join } from 'path'
import { deleteLibroCqrs } from '../cqrs/LibroCqrs.js'
import { insertLibroCqrs } from '../cqrs/LibroCqrs.js'
import { updateLibroCqrs } from '../cqrs/LibroCqrs.js'
import { listLibrosCqrs } from '../dao/LibroDao.js'
import { getLibroByIdCqrs } from '../dao/LibroDao.js'
import { searchLibrosCqrs } from '../dao/LibroDao.js'



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
  const universidad = body.universidad
  if (!nombre || !genero) { res.status(400).json({ error: 'nombre y genero requeridos' }); return }
  const portadaFile = req.files?.portada?.[0]
  const pdfFile = req.files?.pdf?.[0]
  const portadaBase64 = body.portadaBase64
  const pdfBase64 = body.pdfBase64
  const portada = portadaFile ? portadaFile.buffer : (typeof portadaBase64 === 'string' ? Buffer.from(portadaBase64, 'base64') : Buffer.alloc(0))
  const pdf = pdfFile ? pdfFile.buffer : (typeof pdfBase64 === 'string' ? Buffer.from(pdfBase64, 'base64') : Buffer.alloc(0))
  try {
    const nombreFinal = typeof nombre === 'string' ? (nombre.endsWith(' (URV)') ? nombre : (nombre + ' (URV)')) : nombre
    const id = await insertLibroCqrs({ nombre: nombreFinal, genero, universidad, portada, pdf })
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
  let universidad = body.universidad
  const portadaBase64 = body.portadaBase64
  const pdfBase64 = body.pdfBase64
  if (!id_libro || !nombre || !genero) { res.status(400).json({ error: 'id_libro, nombre y genero requeridos' }); return }
  const portadaFile = req.files?.portada?.[0]
  const pdfFile = req.files?.pdf?.[0]
  let portada = portadaFile ? portadaFile.buffer : (typeof portadaBase64 === 'string' ? Buffer.from(portadaBase64, 'base64') : undefined)
  let pdf = pdfFile ? pdfFile.buffer : (typeof pdfBase64 === 'string' ? Buffer.from(pdfBase64, 'base64') : undefined)
  try {
    if (portada === undefined || pdf === undefined) {
      const existing = await getLibroByIdCqrs(id_libro)
      if (!existing) { res.status(404).json({ error: 'Libro no encontrado' }); return }
      if (universidad == null || universidad === '') {
        universidad = existing.universidad ?? null
      }
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
    const success = await updateLibroCqrs({ id_libro, nombre, genero, universidad, portada, pdf })
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
    const libro = await getLibroByIdCqrs(id)
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
    const all = await listLibrosCqrs()
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
    const success = await deleteLibroCqrs(id)
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
    const todos = await listLibrosCqrs()
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
