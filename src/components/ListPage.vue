<template>
  <div>
    <div class="titre-liste">
      <h1 :style="{ color: getListColor(lists, currentListId) }">{{ getListName(lists, currentListId) }}</h1>
      <button class="btn-small grey" @click="$emit('delete-list', currentListId)">Delete list</button>
    </div>

    <div class="liste-et-detail">
      <div class="colonnes">
        <div class="colonne">
          <h4>To Do</h4>
          <div v-for="task in getTasksByStatus('todo')" :key="task.id" class="task" :class="{ selected: isSelected(task) }" @click="$emit('open-task', task)">
            <input type="checkbox" @click.stop="$emit('check-task', task)">
            <div class="task-text">
              <span>{{ task.title }}</span>
              <span class="date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            </div>
            <img v-if="task.flagged" src="/img/flag.svg" class="icone">
          </div>
        </div>
        <div class="colonne">
          <h4>Doing</h4>
          <div v-for="task in getTasksByStatus('doing')" :key="task.id" class="task" :class="{ selected: isSelected(task) }" @click="$emit('open-task', task)">
            <input type="checkbox" @click.stop="$emit('check-task', task)">
            <div class="task-text">
              <span>{{ task.title }}</span>
              <span class="date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            </div>
            <img v-if="task.flagged" src="/img/flag.svg" class="icone">
          </div>
        </div>
        <div class="colonne">
          <h4>Done</h4>
          <div v-for="task in getTasksByStatus('done')" :key="task.id" class="task done" :class="{ selected: isSelected(task) }" @click="$emit('open-task', task)">
            <input type="checkbox" checked @click.stop="$emit('check-task', task)">
            <div class="task-text">
              <span>{{ task.title }}</span>
            </div>
          </div>
        </div>

        <div class="ajout-tache">
          <input type="text" v-model="newTaskTitle" placeholder="New task...">
          <button class="btn-small" @click="addTask()">+ Add</button>
        </div>
      </div>

      <div class="detail" v-if="currentTask != null">
        <div class="detail-top">
          <input class="detail-titre" type="text" :value="currentTask.title" @input="$emit('update-task', 'title', $event.target.value)">
          <img v-if="currentTask.flagged" src="/img/flag.svg" class="flag-btn" @click="toggleFlag()">
          <img v-else src="/img/flag-empty.svg" class="flag-btn" @click="toggleFlag()">
        </div>

        <label>Description</label>
        <textarea :value="currentTask.description" @input="$emit('update-task', 'description', $event.target.value)" placeholder="Add a description"></textarea>

        <label>Date</label>
        <input type="date" :value="currentTask.date" @input="$emit('update-task', 'date', $event.target.value)">

        <label>Location</label>
        <input type="text" :value="currentTask.location" @input="$emit('update-task', 'location', $event.target.value)" placeholder="ex: Concordia University">

        <label>Status</label>
        <div class="status-btns">
          <button :class="{ actif: currentTask.status == 'todo' }" @click="changeStatus('todo')">To Do</button>
          <button :class="{ actif: currentTask.status == 'doing' }" @click="changeStatus('doing')">Doing</button>
          <button :class="{ actif: currentTask.status == 'done' }" @click="changeStatus('done')">Done</button>
        </div>

        <div class="detail-bas">
          <button class="btn-small red" @click="$emit('delete-task', currentTask)">Delete</button>
          <button class="btn-small grey" @click="$emit('close-task')">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, getListName, getListColor } from '../utils.js'

export default {
  props: ['lists', 'tasks', 'currentListId', 'currentTask'],
  emits: ['open-task', 'check-task', 'add-task', 'delete-task', 'delete-list', 'close-task', 'update-task'],

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
      this.$emit('update-task', 'status', status)
    },

    toggleFlag() {
      if (this.currentTask.flagged == true) {
        this.$emit('update-task', 'flagged', false)
      } else {
        this.$emit('update-task', 'flagged', true)
      }
    }
  }
}
</script>
