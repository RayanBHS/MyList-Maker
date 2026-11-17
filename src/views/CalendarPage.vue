<template>
  <div>
    <h1>Calendar</h1>
    <p v-if="dates.length == 0" class="vide">No task with a date</p>
    <div class="liste-taches">
      <div v-for="date in dates" :key="date">
        <h4 :class="{ today: date == today, passee: date < today }">{{ formatDate(date) }}</h4>
        <TaskItem
          v-for="task in getTasksOfDate(date)"
          :key="task.id"
          :task="task"
          :lists="lists"
          :show-check="false"
          :show-date="false"
          :show-circle="true"
          @open-task="$emit('open-task', task)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskItem from '../components/TaskItem.vue'
import { dateToString, formatDate } from '../utils.js'

export default {
  components: {
    TaskItem
  },

  props: ['lists', 'tasks'],
  emits: ['open-task'],

  data() {
    return {
      today: dateToString(new Date())
    }
  },

  computed: {
    dates() {
      let dates = []
      for (let i = 0; i < this.tasks.length; i++) {
        let date = this.tasks[i].date
        if (date != '' && dates.includes(date) == false) {
          dates.push(date)
        }
      }
      dates.sort()
      return dates
    }
  },

  methods: {
    formatDate,

    getTasksOfDate(date) {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].date == date) {
          result.push(this.tasks[i])
        }
      }
      return result
    }
  }
}
</script>
