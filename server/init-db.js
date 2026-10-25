// Crée la base à partir de sql/schema.sql (et sql/seed.sql avec --seed)
// Utilisation :  npm run db:init   ou   npm run db:seed
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'sql')

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
})

await connection.query(fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8'))
console.log('Database created (schema.sql)')

if (process.argv.includes('--seed')) {
  await connection.query(fs.readFileSync(path.join(dir, 'seed.sql'), 'utf8'))
  console.log('Example data added (seed.sql) - account : demo / demo1234')
}

await connection.end()
