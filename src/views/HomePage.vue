<template>
  <div>
    <h1>Home</h1>
    <div class="home-grid">
      <section class="home-gauche">
        <h4>Next Tasks</h4>
        <p v-if="getNextTasks().length == 0" class="vide">Nothing to do</p>
        <div v-for="task in getNextTasks()" :key="task.id" class="task" @click="$emit('open-task', task)">
          <button class="check" :class="{ coche: task.status == 'done' }" @click.stop="$emit('check-task', task)"></button>
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="task-date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            <span class="chip" v-if="task.location != ''"><img src="/img/gmap-pin.svg" alt=""> Go to {{ task.location }}</span>
          </div>
          <img v-if="task.flagged" src="/img/flag.svg" class="task-flag" alt="flagged">
          <span class="rond" :style="{ backgroundColor: getListColor(lists, task.listId) }"><img src="/img/list-icon.svg" alt=""></span>
        </div>
      </section>

      <section class="home-droite">
        <h4>Flagged</h4>
        <p v-if="getFlaggedTasks(tasks).length == 0" class="vide">No flagged task</p>
        <div v-for="task in getFlaggedTasks(tasks)" :key="task.id" class="task" @click="$emit('open-task', task)">
          <button class="check" :class="{ coche: task.status == 'done' }" @click.stop="$emit('check-task', task)"></button>
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="task-date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            <span class="chip" v-if="task.location != ''"><img src="/img/gmap-pin.svg" alt=""> Go to {{ task.location }}</span>
          </div>
          <img src="/img/flag.svg" class="task-flag" alt="flagged">
          <span class="rond" :style="{ backgroundColor: getListColor(lists, task.listId) }"><img src="/img/list-icon.svg" alt=""></span>
        </div>

        <h4 class="titre-map">Location</h4>
        <p v-if="getFirstPlace() == ''" class="vide">No task with a location</p>
        <div v-else class="carte petite">
          <iframe :src="getMapUrl(getFirstPlace())"></iframe>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { formatDate, getListColor, getFlaggedTasks, getMapUrl } from '../utils.js'

export default {
  props: ['lists', 'tasks', 'currentUser'],
  emits: ['open-task', 'check-task'],

  methods: {
    formatDate,
    getListColor,
    getFlaggedTasks,
    getMapUrl,

    getFirstPlace() {
      let next = this.getNextTasks()
      for (let i = 0; i < next.length; i++) {
        if (next[i].location != '') {
          return next[i].location
        }
      }
      return ''
    },

    getNextTasks() {
      let withDate = []
      let withoutDate = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].status != 'done') {
          if (this.tasks[i].date != '') {
            withDate.push(this.tasks[i])
          } else {
            withoutDate.push(this.tasks[i])
          }
        }
      }
      for (let i = 0; i < withDate.length; i++) {
        for (let j = 0; j < withDate.length - 1; j++) {
          if (withDate[j].date > withDate[j + 1].date) {
            let temp = withDate[j]
            withDate[j] = withDate[j + 1]
            withDate[j + 1] = temp
          }
        }
      }
      let result = []
      for (let i = 0; i < withDate.length; i++) {
        result.push(withDate[i])
      }
      for (let i = 0; i < withoutDate.length; i++) {
        result.push(withoutDate[i])
      }
      let firstSix = []
      for (let i = 0; i < result.length && i < 6; i++) {
        firstSix.push(result[i])
      }
      return firstSix
    }
  }
}
</script>
