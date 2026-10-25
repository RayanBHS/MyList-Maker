import { Router } from 'express'
import pool from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

// la base utilise id_list / id_user... le front utilise id / name / color
function toFront(row) {
  return { id: row.id_list, name: row.name, description: row.description, color: row.color }
}

// GET /api/lists
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM to_do_list WHERE id_user = ? ORDER BY id_list', [req.user.id_user])
  res.json(rows.map(toFront))
})

// POST /api/lists  { name, color, description }
router.post('/', async (req, res) => {
  const { name, color, description } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }
  const [result] = await pool.query(
    'INSERT INTO to_do_list (id_user, name, color, description) VALUES (?, ?, ?, ?)',
    [req.user.id_user, name, color || '#3498db', description || null]
  )
  res.status(201).json({ id: result.insertId, name, color: color || '#3498db', description: description || null })
})

// PUT /api/lists/:id  { name, color, description }
router.put('/:id', async (req, res) => {
  const { name, color, description } = req.body
  const [result] = await pool.query(
    'UPDATE to_do_list SET name = COALESCE(?, name), color = COALESCE(?, color), description = COALESCE(?, description) WHERE id_list = ? AND id_user = ?',
    [name ?? null, color ?? null, description ?? null, req.params.id, req.user.id_user]
  )
  if (result.affectedRows == 0) {
    return res.status(404).json({ error: 'List not found' })
  }
  res.json({ ok: true })
})

// DELETE /api/lists/:id  (supprime aussi les tâches : ON DELETE CASCADE)
router.delete('/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM to_do_list WHERE id_list = ? AND id_user = ?', [req.params.id, req.user.id_user])
  if (result.affectedRows == 0) {
    return res.status(404).json({ error: 'List not found' })
  }
  res.json({ ok: true })
})

export default router
