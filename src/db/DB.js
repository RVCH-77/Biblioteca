 // Conexión a la base de datos
import mysql from 'mysql2/promise'


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'Biblioteca',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// exportar la conexión
export default pool
