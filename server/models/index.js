// Les 4 tables du schéma (User, session, TO_DO_LIST, Task) et leurs relations
import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

// ----- User -----
export const User = sequelize.define('User', {
  id_user: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: { msg: 'Email is not valid' } } },
  password_hash: { type: DataTypes.STRING(255), allowNull: false }
}, {
  tableName: 'user',
  createdAt: 'created_at',
  updatedAt: false
})

// ----- session -----
export const Session = sequelize.define('Session', {
  id_session: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  id_user: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  token_hash: { type: DataTypes.CHAR(64), allowNull: false, unique: true }, // SHA-256 du token
  expires_at: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'session',
  createdAt: 'created_at',
  updatedAt: false
})

// ----- TO_DO_LIST -----
export const ToDoList = sequelize.define('ToDoList', {
  id_list: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  id_user: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  color: { type: DataTypes.STRING(7), allowNull: false, defaultValue: '#3498db' }
}, {
  tableName: 'to_do_list',
  createdAt: 'created_at',
  updatedAt: false
})

// ----- Task -----
export const Task = sequelize.define('Task', {
  id_task: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  id_list: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('todo', 'doing', 'done'), allowNull: false, defaultValue: 'todo' },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high'), allowNull: false, defaultValue: 'medium' },
  due_date: { type: DataTypes.DATEONLY, allowNull: true },
  location: { type: DataTypes.STRING(255), allowNull: true },
  flagged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  completed_at: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'task',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

// ----- relations (1,n) -----
// un user a 0..n sessions, une session appartient à 1 user
User.hasMany(Session, { foreignKey: 'id_user', onDelete: 'CASCADE' })
Session.belongsTo(User, { foreignKey: 'id_user' })

// un user a 1..n listes
User.hasMany(ToDoList, { foreignKey: 'id_user', onDelete: 'CASCADE' })
ToDoList.belongsTo(User, { foreignKey: 'id_user' })

// une liste a 1..n tâches (supprimer la liste supprime ses tâches)
ToDoList.hasMany(Task, { foreignKey: 'id_list', onDelete: 'CASCADE' })
Task.belongsTo(ToDoList, { foreignKey: 'id_list' })

export { sequelize }
