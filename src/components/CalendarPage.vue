<template>
  <div>
    <div class="titre-liste">
      <h1>Calendar</h1>
      <div>
        <button class="btn-small grey" @click="previousMonth()">&lt;</button>
        <b class="mois">{{ monthNames[month] }} {{ year }}</b>
        <button class="btn-small grey" @click="nextMonth()">&gt;</button>
      </div>
    </div>
    <div class="calendrier">
      <div class="jour-nom">Mon</div>
      <div class="jour-nom">Tue</div>
      <div class="jour-nom">Wed</div>
      <div class="jour-nom">Thu</div>
      <div class="jour-nom">Fri</div>
      <div class="jour-nom">Sat</div>
      <div class="jour-nom">Sun</div>
      <div v-for="(day, index) in getDaysOfMonth()" :key="index" class="jour" :class="{ vide2: day == 0, today: isToday(day) }">
        <span v-if="day != 0">{{ day }}</span>
        <div v-for="task in getTasksOfDay(day)" :key="task.id" class="mini-task" :style="{ backgroundColor: getListColor(lists, task.listId) }" @click="$emit('open-task', task)">
          {{ task.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateToString, getListColor } from '../utils.js'

export default {
  props: ['lists', 'tasks'],
  emits: ['open-task'],

  data() {
    return {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },

  methods: {
    getListColor,

    getDaysOfMonth() {
      let days = []
      let firstDay = new Date(this.year, this.month, 1).getDay()
      if (firstDay == 0) {
        firstDay = 7
      }
      for (let i = 1; i < firstDay; i++) {
        days.push(0)
      }
      let nbDays = new Date(this.year, this.month + 1, 0).getDate()
      for (let i = 1; i <= nbDays; i++) {
        days.push(i)
      }
      return days
    },

    getTasksOfDay(day) {
      let result = []
      if (day == 0) {
        return result
      }
      let date = dateToString(new Date(this.year, this.month, day))
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].date == date) {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    isToday(day) {
      let d = new Date()
      if (day == d.getDate() && this.month == d.getMonth() && this.year == d.getFullYear()) {
        return true
      }
      return false
    },

    previousMonth() {
      this.month = this.month - 1
      if (this.month < 0) {
        this.month = 11
        this.year = this.year - 1
      }
    },

    nextMonth() {
      this.month = this.month + 1
      if (this.month > 11) {
        this.month = 0
        this.year = this.year + 1
      }
    }
  }
}
</script>
