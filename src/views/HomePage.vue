<template>
  <div>
    <h1>Home</h1>
    <p class="hello">Hello {{ currentUser }} !</p>
    <div class="home-grid">
      <div class="bloc">
        <h4>Next Tasks</h4>
        <p v-if="getNextTasks().length == 0" class="vide">Nothing to do, nice !</p>
        <div v-for="task in getNextTasks()" :key="task.id" class="task" @click="$emit('open-task', task)">
          <input type="checkbox" :checked="task.status == 'done'" @click.stop="$emit('check-task', task)">
          <div class="task-text">
            <span>{{ task.title }}</span>
            <span class="date" v-if="task.date != ''">{{ formatDate(task.date) }}</span>
            <span class="lieu" v-if="task.location != ''"><img src="/img/pin.svg" class="mini-icone"> {{ task.location }}</span>
          </div>
          <span class="pastille" :style="{ backgroundColor: getListColor(lists, task.listId) }"></span>
        </div>
      </div>
      <div class="bloc">
        <h4>Flagged</h4>
        <p v-if="getFlaggedTasks(tasks).length == 0" class="vide">No flagged task</p>
        <div v-for="task in getFlaggedTasks(tasks)" :key="task.id" class="task" @click="$emit('open-task', task)">
          <input type="checkbox" :checked="task.status == 'done'" @click.stop="$emit('check-task', task)">
          <div class="task-text">
            <span>{{ task.title }}</span>
            <span class="lieu" v-if="task.location != ''"><img src="/img/pin.svg" class="mini-icone"> {{ task.location }}</span>
          </div>
          <img src="/img/flag.svg" class="icone">
        </div>

        <h4 class="titre-map">Location</h4>
        <div class="map-construction petite">
          <img src="/img/pin.svg" alt="">
          <p>Map in construction</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, getListColor, getFlaggedTasks } from '../utils.js'

export default {
  props: ['lists', 'tasks', 'currentUser'],
  emits: ['open-task', 'check-task'],

  methods: {
    formatDate,
    getListColor,
    getFlaggedTasks,

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
