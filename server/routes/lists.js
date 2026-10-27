import { Router } from 'express'
import { ToDoList } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// la base utilise id_list / id_user... le front utilise id / name / color
function toFront(list) {
  return { id: list.id_list, name: list.name, description: list.description, color: list.color }
}

// GET /api/lists
router.get('/', async (req, res) => {
  const lists = await ToDoList.findAll({ where: { id_user: req.user.id_user }, order: [['id_list', 'ASC']] })
  res.json(lists.map(toFront))
})

// POST /api/lists  { name, color, description }
router.post('/', async (req, res) => {
  const { name, color, description } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }
  const list = await ToDoList.create({
    id_user: req.user.id_user,
    name: name,
    color: color || '#3498db',
    description: description || null
  })
  res.status(201).json(toFront(list))
})

// PUT /api/lists/:id  { name, color, description }
router.put('/:id', async (req, res) => {
  const list = await ToDoList.findOne({ where: { id_list: req.params.id, id_user: req.user.id_user } })
  if (list == null) {
    return res.status(404).json({ error: 'List not found' })
  }
  const { name, color, description } = req.body
  await list.update({
    name: name ?? list.name,
    color: color ?? list.color,
    description: description ?? list.description
  })
  res.json(toFront(list))
})

// DELETE /api/lists/:id  (supprime aussi les tâches : ON DELETE CASCADE)
router.delete('/:id', async (req, res) => {
  const count = await ToDoList.destroy({ where: { id_list: req.params.id, id_user: req.user.id_user } })
  if (count == 0) {
    return res.status(404).json({ error: 'List not found' })
  }
  res.json({ ok: true })
})

export default router
