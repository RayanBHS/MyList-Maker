// Données d'exemple (les mêmes que celles du front au début) - compte : demo / demo1234
import bcrypt from 'bcryptjs'
import { User, ToDoList, Task } from './models/index.js'

export default async function seed() {
  const today = new Date().toISOString().slice(0, 10)

  const user = await User.create({
    username: 'demo',
    email: 'demo@mylistmaker.local',
    password_hash: await bcrypt.hash('demo1234', 10)
  })

  const work = await ToDoList.create({ id_user: user.id_user, name: "Web's Work", color: '#3498db' })
  const trip = await ToDoList.create({ id_user: user.id_user, name: 'Toronto Trip', color: '#e74c3c' })
  const chores = await ToDoList.create({ id_user: user.id_user, name: 'Chores', color: '#2ecc71' })

  await Task.bulkCreate([
    { id_list: work.id_list, title: 'Starting Project', description: 'Do the milestone 1 and choose the subject of the project with the team', status: 'doing', due_date: today, location: 'Concordia University', flagged: true, position: 1 },
    { id_list: work.id_list, title: 'First step of work', position: 2 },
    { id_list: work.id_list, title: 'Work together at Concordia', location: 'Concordia University', position: 3 },
    { id_list: work.id_list, title: 'New ideas for the project', status: 'done', completed_at: new Date(), position: 4 },
    { id_list: trip.id_list, title: 'Go to the Niagara falls', description: 'Take the bus from Toronto', location: 'Niagara Falls', flagged: true, position: 1 },
    { id_list: trip.id_list, title: 'Return to Paris', location: 'Paris', flagged: true, position: 2 },
    { id_list: chores.id_list, title: 'Do the groceries', description: 'milk, eggs, bread', due_date: today, position: 1 }
  ])
}
