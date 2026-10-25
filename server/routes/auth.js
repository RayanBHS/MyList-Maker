import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../db.js'
import { createSession, hashToken, requireAuth } from '../auth.js'

const router = Router()

// POST /api/auth/register  { username, email, password }
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must have at least 6 characters' })
  }
  const [exists] = await pool.query('SELECT id_user FROM `user` WHERE username = ? OR email = ?', [username, email])
  if (exists.length > 0) {
    return res.status(409).json({ error: 'Username or email already used' })
  }
  const hash = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    'INSERT INTO `user` (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, hash]
  )
  const token = await createSession(result.insertId)
  res.status(201).json({ token, user: { id: result.insertId, username } })
})

// POST /api/auth/login  { username, password }
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const [rows] = await pool.query('SELECT * FROM `user` WHERE username = ?', [username])
  if (rows.length == 0 || (await bcrypt.compare(password || '', rows[0].password_hash)) == false) {
    return res.status(401).json({ error: 'Wrong username or password' })
  }
  const token = await createSession(rows[0].id_user)
  res.json({ token, user: { id: rows[0].id_user, username: rows[0].username } })
})

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM session WHERE token_hash = ?', [hashToken(req.token)])
  res.json({ ok: true })
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user.id_user, username: req.user.username })
})

export default router
