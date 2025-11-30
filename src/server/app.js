import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import router from '../Routes/LibroApi.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configurar middleware para parsear JSON y URL-encoded
app.use(express.json({ limit: '300mb' }))
app.use(express.urlencoded({ extended: true, limit: '300mb' }))
app.use(express.static(join(__dirname, '../../public')))
app.use('/mvp', express.static(join(__dirname, '../mvp')))
app.use('/mvvm', express.static(join(process.cwd(), 'src/mvvm')))
app.use(router)

// Manejo global de errores en JSON
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  res.status(500).json({ error: err?.message || String(err), code: err?.code || undefined })
})

// Iniciar el servidor
const port = process.env.PORT || 3000
app.listen(port, () => { console.log('Listening on ' + port) })
