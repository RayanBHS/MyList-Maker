import crypto from 'crypto'
import { Op } from 'sequelize'
import { User, Session } from '../models/index.js'

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// crée une session pour un user et renvoie le token (valable 7 jours)
export async function createSession(idUser) {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await Session.create({ id_user: idUser, token_hash: hashToken(token), expires_at: expires })
  return token
}

// middleware : vérifie l'en-tête  Authorization: Bearer <token>
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (token == '') {
    return res.status(401).json({ error: 'Not logged in' })
  }
  const session = await Session.findOne({
    where: { token_hash: hashToken(token), expires_at: { [Op.gt]: new Date() } },
    include: User
  })
  if (session == null) {
    return res.status(401).json({ error: 'Session expired' })
  }
  req.user = { id_user: session.User.id_user, username: session.User.username }
  req.token = token
  next()
}
