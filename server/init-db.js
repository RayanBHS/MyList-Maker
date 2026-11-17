
import 'dotenv/config'
import mysql from 'mysql2/promise'
import sequelize from './config/db.js'
import './models/index.js'
import seed from './seed-data.js'

const dbName = process.env.DB_NAME || 'mylist_maker'


const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
})
await connection.query('CREATE DATABASE IF NOT EXISTS `' + dbName + '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
await connection.end()


await sequelize.sync({ force: true })
console.log('Database "' + dbName + '" created with the 4 tables')

if (process.argv.includes('--seed')) {
  await seed()
  console.log('Example data added - account : demo / demo1234')
}

await sequelize.close()
