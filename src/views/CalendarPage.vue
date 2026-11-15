<template>
  <div>
    <h1>Calendar</h1>
    <p v-if="getDates().length == 0" class="vide">No task with a date</p>
    <div class="liste-taches">
      <div v-for="date in getDates()" :key="date">
        <h4 :class="{ today: date == today }">{{ formatDate(date) }}</h4>
        <div v-for="task in getTasksOfDate(date)" :key="task.id" class="task" :class="{ done: task.status == 'done' }" @click="$emit('open-task', task)">
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="chip" v-if="task.location != ''"><img src="/img/gmap-pin.png" alt=""> Go to {{ task.location }}</span>
          </div>
          <img v-if="task.flagged" src="/img/flag.svg" class="task-flag" alt="flagged">
          <span class="rond" :style="{ backgroundColor: getListColor(lists, task.listId) }"><img src="/img/list-icon.svg" alt=""></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateToString, formatDate, getListColor } from '../utils.js'

export default {
  props: ['lists', 'tasks'],
  emits: ['open-task'],

  data() {
    return {
      today: dateToString(new Date())
    }
  },

  methods: {
    formatDate,
    getListColor,

    getDates() {
      let dates = []
      for (let i = 0; i < this.tasks.length; i++) {
        let date = this.tasks[i].date
        if (date != '' && dates.includes(date) == false) {
          dates.push(date)
        }
      }
      dates.sort()
      return dates
    },

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
