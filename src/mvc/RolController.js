
// Controlador para la API de Roles
import express from 'express'
import { listRoles } from '../dao/RolDao.js'
import RolModel from '../mvc/RolModel.js'

const router = express.Router()

// Listar todos los roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await listRolesCqrs()
    res.json(roles.map(rol => new RolModel(rol.id_rol, rol.nombre)))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router