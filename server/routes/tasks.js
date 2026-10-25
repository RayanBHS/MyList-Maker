import { Router } from 'express'
import pool from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

// même forme que les objets de App.vue : { id, listId, title, description, date, location, status, flagged }
function toFront(row) {
  return {
    id: row.id_task,
    listId: row.id_list,
    title: row.title,
    description: row.description || '',
    date: row.due_date || '',
    location: row.location || '',
    status: row.status,
    priority: row.priority,
    flagged: row.flagged == 1
  }
}

// vérifie que la liste appartient bien à l'utilisateur connecté
async function listIsMine(idList, idUser) {
  const [rows] = await pool.query('SELECT id_list FROM to_do_list WHERE id_list = ? AND id_user = ?', [idList, idUser])
  return rows.length > 0
}

// GET /api/tasks  (toutes les tâches de l'utilisateur)
router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT t.* FROM task t
     JOIN to_do_list l ON l.id_list = t.id_list
     WHERE l.id_user = ? ORDER BY t.id_list, t.position, t.id_task`,
    [req.user.id_user]
  )
  res.json(rows.map(toFront))
})

// POST /api/tasks  { listId, title }
router.post('/', async (req, res) => {
  const { listId, title } = req.body
  if (!listId || !title) {
    return res.status(400).json({ error: 'listId and title are required' })
  }
  if ((await listIsMine(listId, req.user.id_user)) == false) {
    return res.status(404).json({ error: 'List not found' })
  }
  const [result] = await pool.query(
    'INSERT INTO task (id_list, title, position) VALUES (?, ?, (SELECT COALESCE(MAX(p.position), 0) + 1 FROM (SELECT position FROM task WHERE id_list = ?) p))',
    [listId, title, listId]
  )
  const [rows] = await pool.query('SELECT * FROM task WHERE id_task = ?', [result.insertId])
  res.status(201).json(toFront(rows[0]))
})

// PUT /api/tasks/:id  { title, description, date, location, status, priority, flagged }
router.put('/:id', async (req, res) => {
  const b = req.body
  const [mine] = await pool.query(
    'SELECT t.* FROM task t JOIN to_do_list l ON l.id_list = t.id_list WHERE t.id_task = ? AND l.id_user = ?',
    [req.params.id, req.user.id_user]
  )
  if (mine.length == 0) {
    return res.status(404).json({ error: 'Task not found' })
  }
  const old = mine[0]
  if (b.title !== undefined && String(b.title).trim() == '') {
    return res.status(400).json({ error: 'The title cannot be empty' })
  }
  const status = b.status ?? old.status
  if (['todo', 'doing', 'done'].includes(status) == false) {
    return res.status(400).json({ error: 'status must be todo, doing or done' })
  }
  // completed_at suit le statut
  let completedAt = old.completed_at
  if (status == 'done' && old.status != 'done') {
    completedAt = new Date()
  } else if (status != 'done') {
    completedAt = null
  }
  await pool.query(
    `UPDATE task SET title = ?, description = ?, due_date = ?, location = ?,
     status = ?, priority = ?, flagged = ?, completed_at = ? WHERE id_task = ?`,
    [
      b.title ?? old.title,
      b.description ?? old.description,
      b.date === undefined ? old.due_date : (b.date || null),
      b.location === undefined ? old.location : (b.location || null),
      status,
      b.priority ?? old.priority,
      b.flagged === undefined ? old.flagged : (b.flagged ? 1 : 0),
      completedAt,
      req.params.id
    ]
  )
  const [rows] = await pool.query('SELECT * FROM task WHERE id_task = ?', [req.params.id])
  res.json(toFront(rows[0]))
})

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const [result] = await pool.query(
    'DELETE t FROM task t JOIN to_do_list l ON l.id_list = t.id_list WHERE t.id_task = ? AND l.id_user = ?',
    [req.params.id, req.user.id_user]
  )
  if (result.affectedRows == 0) {
    return res.status(404).json({ error: 'Task not found' })
  }
  res.json({ ok: true })
})

export default router
