import 'dotenv/config'
import mysql from 'mysql2/promise'

// pool de connexions MySQL, partagé par toutes les routes
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mylist_maker',
  dateStrings: true // les DATE reviennent en texte 'YYYY-MM-DD'
})

export default pool
