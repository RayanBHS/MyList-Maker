<template>
  <LoginPage v-if="isLogged == false" @logged="onLogged" />

  <div v-else class="container">
    <SideBar
      :lists="lists"
      :tasks="tasks"
      :page="page"
      :currentListId="currentListId"
      @open-filter="openFilter"
      @open-list="openList"
      @add-list="addList"
      @change-page="changePage"
    />

    <main class="main">
      <HomePage
        v-if="page == 'home'"
        :lists="lists"
        :tasks="tasks"
        :currentUser="currentUser"
        @open-task="openTask"
        @check-task="checkTask"
      />

      <ListPage
        v-if="page == 'list'"
        :lists="lists"
        :tasks="tasks"
        :currentListId="currentListId"
        :currentTask="currentTask"
        @open-task="openTask"
        @check-task="checkTask"
        @add-task="addTask"
        @delete-task="deleteTask"
        @delete-list="deleteList"
        @close-task="currentTask = null"
        @update-task="updateTask"
      />

      <FilterPage
        v-if="page == 'filter'"
        :lists="lists"
        :tasks="tasks"
        :filter="filter"
        @open-task="openTask"
        @check-task="checkTask"
      />

      <CalendarPage
        v-if="page == 'calendar'"
        :lists="lists"
        :tasks="tasks"
        @open-task="openTask"
      />

      <MapPage v-if="page == 'map'" :tasks="tasks" />

      <SettingsPage
        v-if="page == 'settings'"
        :currentUser="currentUser"
        @logout="logout"
      />
    </main>
  </div>
</template>

<script>
import LoginPage from './components/LoginPage.vue'
import SideBar from './components/SideBar.vue'
import HomePage from './components/HomePage.vue'
import ListPage from './components/ListPage.vue'
import FilterPage from './components/FilterPage.vue'
import CalendarPage from './components/CalendarPage.vue'
import MapPage from './components/MapPage.vue'
import SettingsPage from './components/SettingsPage.vue'
import { dateToString } from './utils.js'

let today = dateToString(new Date())

export default {
  components: {
    LoginPage,
    SideBar,
    HomePage,
    ListPage,
    FilterPage,
    CalendarPage,
    MapPage,
    SettingsPage
  },

  data() {
    return {
      isLogged: false,
      currentUser: '',
      page: 'home',
      currentListId: null,
      currentTask: null,
      filter: 'all',
      lists: [
        { id: 1, name: 'Web\'s Work', color: '#3498db' },
        { id: 2, name: 'Toronto Trip', color: '#e74c3c' },
        { id: 3, name: 'Chores', color: '#2ecc71' }
      ],
      tasks: [
        { id: 1, listId: 1, title: 'Starting Project', description: 'Do the milestone 1 and choose the subject of the project with the team', date: today, location: 'Concordia University', status: 'doing', flagged: true },
        { id: 2, listId: 1, title: 'First step of work', description: '', date: '', location: '', status: 'todo', flagged: false },
        { id: 3, listId: 1, title: 'Work together at Concordia', description: '', date: '', location: 'Concordia University', status: 'todo', flagged: false },
        { id: 4, listId: 1, title: 'New ideas for the project', description: '', date: '', location: '', status: 'done', flagged: false },
        { id: 5, listId: 2, title: 'Go to the Niagara falls', description: 'Take the bus from Toronto', date: '', location: 'Niagara Falls', status: 'todo', flagged: true },
        { id: 6, listId: 2, title: 'Return to Paris', description: '', date: '', location: 'Paris', status: 'todo', flagged: true },
        { id: 7, listId: 3, title: 'Do the groceries', description: 'milk, eggs, bread', date: today, location: '', status: 'todo', flagged: false }
      ]
    }
  },

  methods: {
    onLogged(username) {
      this.currentUser = username
      this.isLogged = true
    },

    logout() {
      this.isLogged = false
      this.currentUser = ''
      this.page = 'home'
      this.currentTask = null
    },

    changePage(page) {
      this.page = page
      this.currentTask = null
    },

    openList(id) {
      this.currentListId = id
      this.currentTask = null
      this.page = 'list'
    },

    openFilter(f) {
      this.filter = f
      this.currentTask = null
      this.page = 'filter'
    },

    addList(name, color) {
      let newId = 1
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id >= newId) {
          newId = this.lists[i].id + 1
        }
      }
      this.lists.push({ id: newId, name: name, color: color })
      this.openList(newId)
    },

    deleteList(id) {
      if (confirm('Delete this list and all its tasks ?') == false) {
        return
      }
      let newLists = []
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id != id) {
          newLists.push(this.lists[i])
        }
      }
      let newTasks = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].listId != id) {
          newTasks.push(this.tasks[i])
        }
      }
      this.lists = newLists
      this.tasks = newTasks
      this.page = 'home'
    },

    addTask(title) {
      let newId = 1
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id >= newId) {
          newId = this.tasks[i].id + 1
        }
      }
      this.tasks.push({
        id: newId,
        listId: this.currentListId,
        title: title,
        description: '',
        date: '',
        location: '',
        status: 'todo',
        flagged: false
      })
    },

    deleteTask(task) {
      let newTasks = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id != task.id) {
          newTasks.push(this.tasks[i])
        }
      }
      this.tasks = newTasks
      this.currentTask = null
    },

    openTask(task) {
      this.currentListId = task.listId
      this.page = 'list'
      this.currentTask = task
    },

    updateTask(field, value) {
      this.currentTask[field] = value
    },

    checkTask(task) {
      if (task.status == 'done') {
        task.status = 'todo'
      } else {
        task.status = 'done'
      }
    }
  }
}
</script>
