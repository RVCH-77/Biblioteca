// routes libro
import express from 'express'
import multer from 'multer'
import { insertLibroController, updateLibroController, getLibroByIdController, listLibrosController, deleteLibroController, searchLibrosController } from '../mvc/LibroController.js'

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 50 * 1024 * 1024,
    fileSize: 50 * 1024 * 1024,
    fields: 20,
    files: 4,
    parts: 30
  }
})

//routes libro
router.post('/libros', upload.fields([{ name: 'portada' }, { name: 'pdf' }]), insertLibroController)
router.put('/libros', upload.fields([{ name: 'portada' }, { name: 'pdf' }]), updateLibroController)
//Busca libros por nombre (debe ir antes de :id para evitar colisión)
router.get('/libros/search/:nombre', searchLibrosController)
router.get('/libros/search', searchLibrosController)
router.get('/libros/:id', getLibroByIdController)
router.get('/libros', listLibrosController)
router.delete('/libros/:id', deleteLibroController)



export default router
