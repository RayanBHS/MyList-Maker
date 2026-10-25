import 'dotenv/config'
import express from 'express'
import authRoutes from './routes/auth.js'
import listRoutes from './routes/lists.js'
import taskRoutes from './routes/tasks.js'

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/tasks', taskRoutes)

// erreurs inattendues (ex : base arrêtée) -> réponse JSON propre
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

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
