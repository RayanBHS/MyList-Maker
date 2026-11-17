import { Router } from 'express'
import { ToDoList } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

function toFront(list) {
  return { id: list.id_list, name: list.name, description: list.description, color: list.color }
}

router.get('/', async (req, res) => {
  const lists = await ToDoList.findAll({ where: { id_user: req.user.id_user }, order: [['id_list', 'ASC']] })
  res.json(lists.map(toFront))
})

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

router.delete('/:id', async (req, res) => {
  const count = await ToDoList.destroy({ where: { id_list: req.params.id, id_user: req.user.id_user } })
  if (count == 0) {
    return res.status(404).json({ error: 'List not found' })
  }
  res.json({ ok: true })
})

export default router
