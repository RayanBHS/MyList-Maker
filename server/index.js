import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import sequelize from './config/db.js'
import authRoutes from './routes/auth.js'
import listRoutes from './routes/lists.js'
import taskRoutes from './routes/tasks.js'

const app = express() // Creating the server called app

app.use(cors()) // Allow localhost:5173 to call localhost:3001
app.use(bodyParser.json()) // Allow to easily read the JSON sent by front-end


app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/tasks', taskRoutes)

// Look for errors like invalid format or duplicate and send back error messages
app.use((err, req, res, next) => {
  if (err.name == 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors[0].message })
  }
  if (err.name == 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Username or email already used' })
  }
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

// Check MySQL connection before going on
try {
  await sequelize.authenticate()
  console.log('MySQL connected')
} catch (e) {
  console.error('Cannot connect to MySQL : ' + e.message)
  console.error('Check that MySQL is running, that the database exists (npm run db:seed) and the DB_ values of the .env file.')
  process.exit(1)
}


const port = process.env.PORT || 3001
app.listen(port, (err) => {
  if (err) {
    if (err.code == 'EADDRINUSE') {
      console.error('Port ' + port + ' is already used by another program. Change PORT in the .env file.')
    } else {
      console.error(err)
    }
    process.exit(1)
  }
  console.log('API running on http://localhost:' + port)
})
