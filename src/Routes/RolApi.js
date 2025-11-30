// Routes para rol
import express from 'express'

import { listRolesViewModel } from '../mvvm/RolViewModel.js'

// Listar todos los roles
router.get('/roles', listRolesViewModel)
export default router
