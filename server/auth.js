import crypto from 'crypto'
import pool from './db.js'

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// crée une session pour un user et renvoie le token (valable 7 jours)
export async function createSession(idUser) {
  const token = crypto.randomBytes(32).toString('hex')
  await pool.query(
    'INSERT INTO session (id_user, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
    [idUser, hashToken(token)]
  )
  return token
}

// middleware : vérifie l'en-tête  Authorization: Bearer <token>
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (token == '') {
    return res.status(401).json({ error: 'Not logged in' })
  }
  const [rows] = await pool.query(
    `SELECT u.id_user, u.username FROM session s
     JOIN \`user\` u ON u.id_user = s.id_user
     WHERE s.token_hash = ? AND s.expires_at > NOW()`,
    [hashToken(token)]
  )
  if (rows.length == 0) {
    return res.status(401).json({ error: 'Session expired' })
  }
  req.user = rows[0]
  req.token = token
  next()
}
