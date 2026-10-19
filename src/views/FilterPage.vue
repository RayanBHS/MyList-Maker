<template>
  <div>
    <h1>{{ getTitle() }}</h1>
    <p v-if="getFilteredTasks().length == 0" class="vide">No task here</p>
    <div v-for="task in getFilteredTasks()" :key="task.id" class="task" @click="$emit('open-task', task)">
      <input type="checkbox" :checked="task.status == 'done'" @click.stop="$emit('check-task', task)">
      <div class="task-text">
        <span>{{ task.title }}</span>
        <span class="date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
      </div>
      <span class="tag" :style="{ backgroundColor: getListColor(lists, task.listId) }">{{ getListName(lists, task.listId) }}</span>
    </div>
  </div>
</template>

<script>
import { formatDate, getListName, getListColor, getFlaggedTasks, getScheduledTasks, getTodayTasks } from '../utils.js'

export default {
  props: ['lists', 'tasks', 'filter'],
  emits: ['open-task', 'check-task'],

  methods: {
    formatDate,
    getListName,
    getListColor,

    getTitle() {
      if (this.filter == 'scheduled') {
        return 'Scheduled'
      }
      if (this.filter == 'flagged') {
        return 'Flagged'
      }
      if (this.filter == 'today') {
        return 'Today'
      }
      return 'All'
    },

    getFilteredTasks() {
      if (this.filter == 'scheduled') {
        return getScheduledTasks(this.tasks)
      }
      if (this.filter == 'flagged') {
        return getFlaggedTasks(this.tasks)
      }
      if (this.filter == 'today') {
        return getTodayTasks(this.tasks)
      }
      return this.tasks
    }
  }
}
</script>
