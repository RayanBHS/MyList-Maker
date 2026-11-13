<template>
  <div>
    <h1>{{ getTitle() }}</h1>
    <p v-if="getFilteredTasks().length == 0" class="vide">No task here</p>
    <div class="filtre-liste">
      <div v-for="task in getFilteredTasks()" :key="task.id" class="task" @click="$emit('open-task', task)">
        <button class="check" :class="{ coche: task.status == 'done' }" @click.stop="$emit('check-task', task)"></button>
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="task-date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            <span class="chip" v-if="task.location != ''"><img src="/img/gmap-pin.svg" alt=""> Go to {{ task.location }}</span>
          </div>
        <img v-if="task.flagged" src="/img/ic-flag.svg" class="task-flag" alt="flagged">
        <span class="tag" :style="{ backgroundColor: getListColor(lists, task.listId) }">{{ getListName(lists, task.listId) }}</span>
      </div>
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
