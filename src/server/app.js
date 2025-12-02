import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import router from '../Routes/LibroApi.js'
import usuarioRouter from '../Routes/UsuarioApi.js'
import { listRoles } from '../dao/RolDao.js'
import RolModel from '../mvc/RolModel.js'
import { listUsuarios, getUsuarioByNombre } from '../dao/UsuarioDao.js'
import { insertUsuarioController, updateUsuarioController, deleteUsuarioController, listUsuariosController, getUsuarioByIdController } from '../mvc/UsuarioController.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configurar middleware para parsear JSON y URL-encoded
app.use(express.json({ limit: '300mb' }))
app.use(express.urlencoded({ extended: true, limit: '300mb' }))
// Rutas API primero para evitar que static intercepte y devuelva 404 HTML
app.use(router)
app.use(usuarioRouter)
// Archivos estáticos montados bajo prefijos específicos
app.use('/mvp', express.static(join(__dirname, '../mvp')))
app.use('/mvvm', express.static(join(process.cwd(), 'src/mvvm')))
app.use('/ddd', express.static(join(__dirname, '../ddd')))
app.use('/public', express.static(join(__dirname, '../../public')))

app.post('/usuarios', insertUsuarioController)
app.put('/usuarios/:id', updateUsuarioController)
app.get('/usuarios', listUsuariosController)
app.get('/usuarios/:id', getUsuarioByIdController)
app.delete('/usuarios/:id', deleteUsuarioController)

app.post('/usuarios/login', async (req,res)=>{
  try{
    const { nombre, contrasena } = req.body || {}
    const u = await getUsuarioByNombre(nombre)
    if(!u || String(u.contrasena) !== String(contrasena)){
      return res.status(401).json({ error: 'invalid_credentials' })
    }
    res.json({ id_usuario: u.id_usuario, nombre: u.nombre, id_rol_fk: u.id_rol_fk })
  }catch(err){
    res.status(500).json({ error: err?.message || String(err) })
  }
})


// saltarse la ventana de ngrok para obtener libros externos




app.get('/externo/libros', async (req,res)=>{
  try{
    const r = await fetch('https://unillusioned-incompactly-kelsey.ngrok-free.dev/biblioteca_web/api/libros/buscar', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    if(!r.ok){
      return res.status(r.status).send(await r.text())
    }
    const data = await r.json()
    res.json(data)
  }catch(err){
    res.status(500).json({ error: err?.message || String(err) })
  }
})
// Ruta para obtener libros externos desde ngrok
app.get('/externo/libros_ngrok', async (req,res)=>{
  try{
    const r = await fetch('https://7cc985afbc6f.ngrok-free.app/books/all', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    if(!r.ok){
      return res.status(r.status).send(await r.text())
    }
    const data = await r.json()
    res.json(data)
  }catch(err){
    res.status(500).json({ error: err?.message || String(err) })
  }
})

app.get('/roles', async (req,res)=>{
  try{
    const roles = await listRoles()
    res.json(roles.map(r=>new RolModel(r.id_rol, r.nombre)))
  }catch(err){
    res.status(500).json({ error: err?.message || String(err) })
  }
})


// Manejo global de errores en JSON
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  res.status(500).json({ error: err?.message || String(err), code: err?.code || undefined })
})

// Iniciar el servidor
const port = process.env.PORT || 3000
app.listen(port, () => { console.log('Listening on ' + port) })
