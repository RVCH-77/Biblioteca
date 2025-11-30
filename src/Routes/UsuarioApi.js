import express from 'express'
import { insertUsuarioController, updateUsuarioController, deleteUsuarioController, listUsuariosController, getUsuarioByIdController } from '../mvc/UsuarioController.js'

const router = express.Router()

router.post('/usuarios', insertUsuarioController)
router.put('/usuarios/:id', updateUsuarioController)
router.get('/usuarios', listUsuariosController)
router.get('/usuarios/:id', getUsuarioByIdController)
router.delete('/usuarios/:id', deleteUsuarioController)

export default router
