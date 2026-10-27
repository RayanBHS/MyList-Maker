import { Router } from 'express'
import { Task, ToDoList } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// même forme que les objets du front : { id, listId, title, description, date, location, status, flagged }
function toFront(task) {
  return {
    id: task.id_task,
    listId: task.id_list,
    title: task.title,
    description: task.description || '',
    date: task.due_date || '',
    location: task.location || '',
    status: task.status,
    priority: task.priority,
    flagged: task.flagged == true
  }
}

// cherche une tâche, seulement si sa liste appartient à l'utilisateur connecté
function findMyTask(idTask, idUser) {
  return Task.findOne({
    where: { id_task: idTask },
    include: { model: ToDoList, attributes: [], where: { id_user: idUser } }
  })
}

// GET /api/tasks  (toutes les tâches de l'utilisateur)
router.get('/', async (req, res) => {
  const tasks = await Task.findAll({
    include: { model: ToDoList, attributes: [], where: { id_user: req.user.id_user } },
    order: [['id_list', 'ASC'], ['position', 'ASC'], ['id_task', 'ASC']]
  })
  res.json(tasks.map(toFront))
})

// POST /api/tasks  { listId, title }
router.post('/', async (req, res) => {
  const { listId, title } = req.body
  if (!listId || !title) {
    return res.status(400).json({ error: 'listId and title are required' })
  }
  const list = await ToDoList.findOne({ where: { id_list: listId, id_user: req.user.id_user } })
  if (list == null) {
    return res.status(404).json({ error: 'List not found' })
  }
  const last = (await Task.max('position', { where: { id_list: listId } })) || 0
  const task = await Task.create({ id_list: listId, title: title, position: last + 1 })
  await task.reload() // récupère les valeurs par défaut (status, priority...)
  res.status(201).json(toFront(task))
})

// PUT /api/tasks/:id  { title, description, date, location, status, priority, flagged }
router.put('/:id', async (req, res) => {
  const b = req.body
  const task = await findMyTask(req.params.id, req.user.id_user)
  if (task == null) {
    return res.status(404).json({ error: 'Task not found' })
  }
  if (b.title !== undefined && String(b.title).trim() == '') {
    return res.status(400).json({ error: 'The title cannot be empty' })
  }
  const status = b.status ?? task.status
  if (['todo', 'doing', 'done'].includes(status) == false) {
    return res.status(400).json({ error: 'status must be todo, doing or done' })
  }
  // completed_at suit le statut
  let completedAt = task.completed_at
  if (status == 'done' && task.status != 'done') {
    completedAt = new Date()
  } else if (status != 'done') {
    completedAt = null
  }
  await task.update({
    title: b.title ?? task.title,
    description: b.description ?? task.description,
    due_date: b.date === undefined ? task.due_date : (b.date || null),
    location: b.location === undefined ? task.location : (b.location || null),
    status: status,
    priority: b.priority ?? task.priority,
    flagged: b.flagged === undefined ? task.flagged : b.flagged == true,
    completed_at: completedAt
  })
  res.json(toFront(task))
})

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const task = await findMyTask(req.params.id, req.user.id_user)
  if (task == null) {
    return res.status(404).json({ error: 'Task not found' })
  }
  await task.destroy()
  res.json({ ok: true })
})

export default router
