<template>
  <div>
    <h1>Home</h1>
    <div class="home-grid">
      <section class="home-gauche">
        <h4>Next Tasks</h4>
        <p v-if="nextTasks.length == 0" class="vide">Nothing to do</p>
        <TaskItem
          v-for="task in nextTasks"
          :key="task.id"
          :task="task"
          :lists="lists"
          :show-circle="true"
          @open-task="$emit('open-task', task)"
          @check-task="$emit('check-task', task)"
        />
      </section>

      <section class="home-droite">
        <h4>Flagged</h4>
        <p v-if="flaggedTasks.length == 0" class="vide">No flagged task</p>
        <TaskItem
          v-for="task in flaggedTasks"
          :key="task.id"
          :task="task"
          :lists="lists"
          :show-circle="true"
          @open-task="$emit('open-task', task)"
          @check-task="$emit('check-task', task)"
        />

        <h4 class="titre-map">Location</h4>
        <p v-if="firstPlace == ''" class="vide">No task with a location</p>
        <div v-else class="carte petite">
          <iframe :src="getMapUrl(firstPlace)"></iframe>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import TaskItem from '../components/TaskItem.vue'
import { getFlaggedTasks, getMapUrl } from '../utils.js'

export default {
  components: {
    TaskItem
  },

  props: ['lists', 'tasks', 'currentUser'],
  emits: ['open-task', 'check-task'],

  computed: {
    nextTasks() {
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
    },

    flaggedTasks() {
      return getFlaggedTasks(this.tasks)
    },

    firstPlace() {
      let next = this.nextTasks
      for (let i = 0; i < next.length; i++) {
        if (next[i].location != '') {
          return next[i].location
        }
      }
      return ''
    }
  },

  methods: {
    getMapUrl
  }
}
</script>
