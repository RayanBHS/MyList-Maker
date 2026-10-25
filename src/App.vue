<template>
  <div v-if="loading" class="chargement">Loading...</div>

  <LoginPage v-else-if="isLogged == false" @logged="onLogged" />

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
          @save-task="saveTask"
          @delete-task="deleteTask"
          @delete-list="deleteList"
          @close-task="currentTask = null"
          @logout="logout"
      />
    </main>
  </div>
</template>

<script>
// navigation vue router
import LoginPage from './components/LoginPage.vue'
import SideBar from './components/SideBar.vue'
import * as api from './api.js'

export default {
  components: {
    LoginPage,
    SideBar
  },

  data() {
    return {
      loading: true,
      isLogged: false,
      currentUser: '',
      currentTask: null,
      lists: [],
      tasks: []
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

  // quand la page s'ouvre : si on a un token, on regarde s'il est encore valable
  async created() {
    if (api.getToken()) {
      try {
        let user = await api.getMe()
        this.currentUser = user.username
        await this.loadData()
        this.isLogged = true
      } catch (e) {
        api.clearToken()
      }
    }
    this.loading = false
  },

  methods: {
    // charge les listes et les taches de l'utilisateur depuis la base
    async loadData() {
      this.lists = await api.getLists()
      this.tasks = await api.getTasks()
      // la tache ouverte doit pointer vers le nouvel objet
      if (this.currentTask != null) {
        let found = null
        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].id == this.currentTask.id) {
            found = this.tasks[i]
          }
        }
        this.currentTask = found
      }
    },

    // erreur du serveur : si la session est finie on revient au login,
    // sinon on affiche le message et on recharge les donnees de la base
    async onError(e) {
      if (e.status == 401) {
        this.resetSession()
        return
      }
      alert(e.message)
      try {
        await this.loadData()
      } catch (e2) {
        // le serveur ne répond pas, on garde l'écran tel quel
      }
    },

    resetSession() {
      api.clearToken()
      this.isLogged = false
      this.currentUser = ''
      this.currentTask = null
      this.lists = []
      this.tasks = []
    },

    async onLogged(username) {
      this.currentUser = username
      try {
        await this.loadData()
        this.isLogged = true
      } catch (e) {
        this.resetSession()
        alert(e.message)
      }
    },

    async logout() {
      await api.logout()
      this.resetSession()
      this.$router.push('/')
    },

    async addList(name, color) {
      try {
        let list = await api.createList(name, color)
        this.lists.push({ id: list.id, name: list.name, color: list.color })
        this.$router.push('/list/' + list.id)
      } catch (e) {
        this.onError(e)
      }
    },

    async deleteList(id) {
      if (confirm('Delete this list and all its tasks ?') == false) {
        return
      }
      try {
        await api.deleteList(id)
      } catch (e) {
        this.onError(e)
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
      this.currentTask = null
      this.$router.push('/')
    },

    async addTask(title) {
      try {
        let task = await api.createTask(this.currentListId, title)
        this.tasks.push(task)
      } catch (e) {
        this.onError(e)
      }
    },

    // enregistre dans la base les modifications d'une tache
    async saveTask(task) {
      try {
        await api.updateTask(task)
      } catch (e) {
        this.onError(e)
      }
    },

    async deleteTask(task) {
      try {
        await api.deleteTask(task.id)
      } catch (e) {
        this.onError(e)
        return
      }
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
      this.saveTask(task)
    }
  }
}
</script>
