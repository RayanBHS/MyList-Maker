<template>
  <div>
    <div class="titre-liste">
      <h1>{{ getListName(lists, currentListId) }}</h1>
      <div class="titre-icones">
        <span class="rond grand" :style="{ backgroundColor: getListColor(lists, currentListId) }"><img src="/img/list-icon.svg" alt=""></span>
        <button class="bouton-rond" title="Delete list" @click="$emit('delete-list', currentListId)"><img src="/img/trash.svg" alt="Delete list"></button>
      </div>
    </div>

    <div class="liste-et-detail">
      <div class="colonnes">
        <h4>To Do</h4>
        <p v-if="getTasksByStatus('todo').length == 0" class="vide">Nothing here</p>
        <div v-for="task in getTasksByStatus('todo')" :key="task.id" class="task" :class="{ selected: isSelected(task) }" @click="$emit('open-task', task)">
          <button class="check" @click.stop="$emit('check-task', task)"></button>
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="task-date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            <span class="chip" v-if="task.location != ''"><img src="/img/gmap-pin.svg" alt=""> Go to {{ task.location }}</span>
          </div>
          <img v-if="task.flagged" src="/img/ic-flag.svg" class="task-flag" alt="flagged">
        </div>

        <h4>Doing</h4>
        <p v-if="getTasksByStatus('doing').length == 0" class="vide">Nothing here</p>
        <div v-for="task in getTasksByStatus('doing')" :key="task.id" class="task" :class="{ selected: isSelected(task) }" @click="$emit('open-task', task)">
          <button class="check" @click.stop="$emit('check-task', task)"></button>
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="task-date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            <span class="chip" v-if="task.location != ''"><img src="/img/gmap-pin.svg" alt=""> Go to {{ task.location }}</span>
          </div>
          <img v-if="task.flagged" src="/img/ic-flag.svg" class="task-flag" alt="flagged">
        </div>

        <h4>Done</h4>
        <p v-if="getTasksByStatus('done').length == 0" class="vide">Nothing here</p>
        <div v-for="task in getTasksByStatus('done')" :key="task.id" class="task done" :class="{ selected: isSelected(task) }" @click="$emit('open-task', task)">
          <button class="check coche" @click.stop="$emit('check-task', task)"></button>
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="task-date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            <span class="chip" v-if="task.location != ''"><img src="/img/gmap-pin.svg" alt=""> Go to {{ task.location }}</span>
          </div>
          <img v-if="task.flagged" src="/img/ic-flag.svg" class="task-flag" alt="flagged">
        </div>

        <form class="ajout-tache" @submit.prevent="addTask()">
          <input type="text" v-model="newTaskTitle" placeholder="+ New task">
          <button type="submit" class="pill">Add</button>
        </form>
      </div>

      <div class="detail" v-if="currentTask != null && currentTask.listId == currentListId">
        <div class="detail-top">
          <input class="detail-titre" type="text" v-model="currentTask.title" @change="$emit('save-task', currentTask)">
          <img v-if="currentTask.flagged" src="/img/ic-flag.svg" class="flag-btn" alt="Remove flag" @click="toggleFlag()">
          <img v-else src="/img/flag-empty.svg" class="flag-btn" alt="Add flag" @click="toggleFlag()">
          <img src="/img/close.svg" class="flag-btn" alt="Close" @click="$emit('close-task')">
        </div>

        <input class="detail-date" type="date" v-model="currentTask.date" @change="$emit('save-task', currentTask)">

        <textarea v-model="currentTask.description" placeholder="Add a description" @change="$emit('save-task', currentTask)"></textarea>

        <router-link to="/map" class="map-construction detail-map" v-if="currentTask.location != ''">
          <img src="/img/pin.svg" alt="">
          <p>Map in construction</p>
        </router-link>

        <label class="detail-lieu">
          Location :
          <input type="text" v-model="currentTask.location" placeholder="add a location" @change="$emit('save-task', currentTask)">
        </label>

        <div class="detail-bas">
          <button class="pill" :class="{ actif: currentTask.status == 'todo' }" @click="changeStatus('todo')">To Do</button>
          <button class="pill" :class="{ actif: currentTask.status == 'doing' }" @click="changeStatus('doing')">Doing</button>
          <button class="pill" :class="{ actif: currentTask.status == 'done' }" @click="changeStatus('done')">Done</button>
          <button class="bouton-rond petit" title="Delete task" @click="$emit('delete-task', currentTask)"><img src="/img/trash.svg" alt="Delete task"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, getListName, getListColor } from '../utils.js'

export default {
  props: ['lists', 'tasks', 'currentListId', 'currentTask'],
  emits: ['open-task', 'check-task', 'add-task', 'delete-task', 'delete-list', 'close-task', 'save-task'],

  data() {
    return {
      newTaskTitle: ''
    }
  },

  methods: {
    formatDate,
    getListName,
    getListColor,

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

    changeStatus(status) {
      this.currentTask.status = status
      this.$emit('save-task', this.currentTask)
    },

    toggleFlag() {
      if (this.currentTask.flagged == true) {
        this.currentTask.flagged = false
      } else {
        this.currentTask.flagged = true
      }
      this.$emit('save-task', this.currentTask)
    }
  }
}
</script>
