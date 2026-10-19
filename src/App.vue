<template>
  <LoginPage v-if="isLogged == false" @logged="onLogged" />

  <div v-else class="container">
    <SideBar
      :lists="lists"
      :tasks="tasks"
      :currentListId="currentListId"
      @add-list="addList"
    />

    <main class="main">
      <router-view
        :lists="lists"
        :tasks="tasks"
        :currentUser="currentUser"
        :currentListId="currentListId"
        :currentTask="currentTask"
        :filter="filter"
        @open-task="openTask"
        @check-task="checkTask"
        @add-task="addTask"
        @delete-task="deleteTask"
        @delete-list="deleteList"
        @close-task="currentTask = null"
        @logout="logout"
      />
    </main>
  </div>
</template>

<script>
import LoginPage from './components/LoginPage.vue'
import SideBar from './components/SideBar.vue'
import { dateToString } from './utils.js'

let today = dateToString(new Date())

export default {
  components: {
    LoginPage,
    SideBar
  },

  data() {
    return {
      isLogged: false,
      currentUser: '',
      currentTask: null,
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

  computed: {
    // the id of the list is in the url : /list/2
    currentListId() {
      if (this.$route.params.id) {
        return parseInt(this.$route.params.id)
      }
      return null
    },

    // the filter is in the url : /filter/flagged
    filter() {
      return this.$route.params.filter
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
      this.currentTask = null
      this.$router.push('/')
    },

    addList(name, color) {
      let newId = 1
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id >= newId) {
          newId = this.lists[i].id + 1
        }
      }
      this.lists.push({ id: newId, name: name, color: color })
      this.$router.push('/list/' + newId)
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
      this.$router.push('/')
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
      this.currentTask = task
      this.$router.push('/list/' + task.listId)
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
