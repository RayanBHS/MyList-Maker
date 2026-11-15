<template>
  <div>
    <h1>{{ title }}</h1>
    <p v-if="filteredTasks.length == 0" class="vide">No task here</p>
    <div class="liste-taches">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :lists="lists"
        :show-tag="true"
        @open-task="$emit('open-task', task)"
        @check-task="$emit('check-task', task)"
      />
    </div>
  </div>
</template>

<script>
import TaskItem from '../components/TaskItem.vue'
import { getFlaggedTasks, getScheduledTasks, getTodayTasks } from '../utils.js'

export default {
  components: {
    TaskItem
  },

  props: ['lists', 'tasks', 'filter'],
  emits: ['open-task', 'check-task'],

  computed: {
    title() {
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

    filteredTasks() {
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
