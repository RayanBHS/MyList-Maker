import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import { User, Session } from '../models/index.js'
import { createSession, hashToken, requireAuth } from '../middleware/auth.js'

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
  const exists = await User.findOne({ where: { [Op.or]: [{ username: username }, { email: email }] } })
  if (exists != null) {
    return res.status(409).json({ error: 'Username or email already used' })
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ username: username, email: email, password_hash: hash })
  const token = await createSession(user.id_user)
  res.status(201).json({ token, user: { id: user.id_user, username: user.username } })
})

// POST /api/auth/login  { username, password }
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username: username || '' } })
  if (user == null || (await bcrypt.compare(password || '', user.password_hash)) == false) {
    return res.status(401).json({ error: 'Wrong username or password' })
  }
  const token = await createSession(user.id_user)
  res.json({ token, user: { id: user.id_user, username: user.username } })
})

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  await Session.destroy({ where: { token_hash: hashToken(req.token) } })
  res.json({ ok: true })
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user.id_user, username: req.user.username })
})

export default router
