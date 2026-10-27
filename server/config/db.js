// Connexion à MySQL avec Sequelize (ORM)
import 'dotenv/config'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mylist_maker',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false // mettre console.log pour voir les requetes SQL
  }
)

export default sequelize
