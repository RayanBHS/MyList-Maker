// Crée la base et les tables à partir des modèles Sequelize
// Utilisation :  npm run db:init   (tables vides)   ou   npm run db:seed   (avec les données d'exemple)
// ATTENTION : les tables existantes sont supprimées puis recréées.
import 'dotenv/config'
import mysql from 'mysql2/promise'
import sequelize from './config/db.js'
import './models/index.js'
import seed from './seed-data.js'

const dbName = process.env.DB_NAME || 'mylist_maker'

// 1. la base de données doit exister avant que Sequelize s'y connecte
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
})
await connection.query('CREATE DATABASE IF NOT EXISTS `' + dbName + '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
await connection.end()

// 2. Sequelize crée les tables à partir des modèles
await sequelize.sync({ force: true })
console.log('Database "' + dbName + '" created with the 4 tables')

if (process.argv.includes('--seed')) {
  await seed()
  console.log('Example data added - account : demo / demo1234')
}

await sequelize.close()
