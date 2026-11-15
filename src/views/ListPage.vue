<template>
  <div v-if="!currentList" class="liste-non-trouvee">
    <h1>List not found</h1>
    <p class="vide">This list does not exist.</p>
    <router-link to="/" class="pill">Back to home</router-link>
  </div>

  <div v-else>
    <div class="titre-liste">
      <h1>{{ currentListName }}</h1>
      <div class="titre-icones">
        <span class="rond grand" :style="{ backgroundColor: currentListColor }">
          <img src="/img/list-icon.svg" alt="">
        </span>
        <button class="bouton-rond" title="Edit list" @click="openEditModal">
          <img src="/img/edit.svg" alt="Edit list">
        </button>
        <button class="bouton-rond" title="Delete list" @click="$emit('delete-list', currentListId)">
          <img src="/img/trash.svg" alt="Delete list">
        </button>
      </div>
    </div>

    <div class="liste-et-detail">
      <div class="colonnes">
        <h4>To Do</h4>
        <p v-if="todoTasks.length == 0" class="vide">Nothing here</p>
        <TaskItem
          v-for="task in todoTasks"
          :key="task.id"
          :task="task"
          :selected="isSelected(task)"
          @open-task="$emit('open-task', task)"
          @check-task="$emit('check-task', task)"
        />

        <h4>Doing</h4>
        <p v-if="doingTasks.length == 0" class="vide">Nothing here</p>
        <TaskItem
          v-for="task in doingTasks"
          :key="task.id"
          :task="task"
          :selected="isSelected(task)"
          @open-task="$emit('open-task', task)"
          @check-task="$emit('check-task', task)"
        />

        <h4>Done</h4>
        <p v-if="doneTasks.length == 0" class="vide">Nothing here</p>
        <TaskItem
          v-for="task in doneTasks"
          :key="task.id"
          :task="task"
          :selected="isSelected(task)"
          @open-task="$emit('open-task', task)"
          @check-task="$emit('check-task', task)"
        />

        <form class="ajout-tache" @submit.prevent="addTask()">
          <input type="text" v-model="newTaskTitle" placeholder="+ New task">
          <button type="submit" class="pill">Add</button>
        </form>
      </div>

      <div class="detail" v-if="localTask != null && localTask.listId == currentListId">
        <div class="detail-top">
          <input class="detail-titre" type="text" v-model="localTask.title" @change="saveLocalTask">
          <img v-if="localTask.flagged" src="/img/flag.svg" class="flag-btn" alt="Remove flag" @click="toggleFlag()">
          <img v-else src="/img/flag-empty.svg" class="flag-btn" alt="Add flag" @click="toggleFlag()">
          <img src="/img/close.svg" class="flag-btn" alt="Close" @click="$emit('close-task')">
        </div>

        <input class="detail-date" type="date" v-model="localTask.date" @change="saveLocalTask">

        <textarea v-model="localTask.description" placeholder="Add a description" @change="saveLocalTask"></textarea>

        <div class="carte detail-map" v-if="localTask.location != ''">
          <iframe :src="getMapUrl(localTask.location)"></iframe>
        </div>

        <label class="detail-lieu">
          Location :
          <input type="text" v-model="localTask.location" placeholder="add a location" @change="saveLocalTask">
        </label>

        <div class="detail-bas">
          <button class="pill" :class="{ actif: localTask.status == 'todo' }" @click="changeStatus('todo')">To Do</button>
          <button class="pill" :class="{ actif: localTask.status == 'doing' }" @click="changeStatus('doing')">Doing</button>
          <button class="pill" :class="{ actif: localTask.status == 'done' }" @click="changeStatus('done')">Done</button>
          <button class="bouton-rond petit" title="Delete task" @click="$emit('delete-task', localTask)">
            <img src="/img/trash.svg" alt="Delete task">
          </button>
        </div>
      </div>
    </div>

    <!-- Modal modification de liste -->
    <div v-if="showEditModal" class="modal-backdrop" @click.self="showEditModal = false">
      <div class="modal-contenu">
        <p>Edit list</p>
        <div class="modal-form">
          <input type="text" v-model="editName" placeholder="Name of the list" class="modal-input">
          <select v-model="editColor" class="modal-select">
            <option value="#e74c3c">Red</option>
            <option value="#3498db">Blue</option>
            <option value="#2ecc71">Green</option>
            <option value="#f39c12">Orange</option>
            <option value="#9b59b6">Purple</option>
            <option value="#1d2b6b">Navy</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="pill gris" @click="showEditModal = false">Cancel</button>
          <button class="pill" @click="saveEditList()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskItem from '../components/TaskItem.vue'
import { getMapUrl } from '../utils.js'

export default {
  components: {
    TaskItem
  },

  props: ['lists', 'tasks', 'currentListId', 'currentTask'],
  emits: ['open-task', 'check-task', 'add-task', 'delete-task', 'delete-list', 'edit-list', 'close-task', 'save-task'],

  data() {
    return {
      newTaskTitle: '',
      localTask: null,
      showEditModal: false,
      editName: '',
      editColor: '#3498db'
    }
  },

  watch: {
    currentTask: {
      immediate: true,
      deep: true,
      handler(newTask) {
        if (newTask) {
          this.localTask = { ...newTask }
        } else {
          this.localTask = null
        }
      }
    }
  },

  computed: {
    currentList() {
      if (!this.lists || this.currentListId == null) {
        return null
      }
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id == this.currentListId) {
          return this.lists[i]
        }
      }
      return null
    },

    currentListName() {
      return this.currentList ? this.currentList.name : ''
    },

    currentListColor() {
      return this.currentList ? this.currentList.color : 'grey'
    },

    todoTasks() {
      return this.getTasksByStatus('todo')
    },

    doingTasks() {
      return this.getTasksByStatus('doing')
    },

    doneTasks() {
      return this.getTasksByStatus('done')
    }
  },

  methods: {
    getMapUrl,

    getTasksByStatus(status) {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].listId == this.currentListId && this.tasks[i].status == status) {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    isSelected(task) {
      if (this.currentTask != null && this.currentTask.id == task.id) {
        return true
      }
      return false
    },

    addTask() {
      if (this.newTaskTitle == '') {
        return
      }
      this.$emit('add-task', this.newTaskTitle)
      this.newTaskTitle = ''
    },

    saveLocalTask() {
      if (this.localTask) {
        this.$emit('save-task', { ...this.localTask })
      }
    },

    changeStatus(status) {
      if (this.localTask) {
        this.localTask.status = status
        this.saveLocalTask()
      }
    },

    toggleFlag() {
      if (this.localTask) {
        this.localTask.flagged = !this.localTask.flagged
        this.saveLocalTask()
      }
    },

    openEditModal() {
      if (!this.currentList) return
      this.editName = this.currentListName
      this.editColor = this.currentListColor
      this.showEditModal = true
    },

    saveEditList() {
      if (this.editName.trim() == '') {
        return
      }
      this.$emit('edit-list', this.currentListId, this.editName.trim(), this.editColor)
      this.showEditModal = false
    }
  }
}
</script>
