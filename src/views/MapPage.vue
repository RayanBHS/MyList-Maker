<template>
  <div>
    <h1>Location</h1>
    <div class="page-map">
      <div class="liste-lieux">
        <p v-if="tasksWithLocation.length == 0" class="vide">No task with a location</p>
        <div v-for="task in tasksWithLocation" :key="task.id" class="task" :class="{ selected: selectedTask == task }" @click="mapTask = task">
          <div class="task-text">
            <span class="task-titre">{{ task.title }}</span>
            <span class="chip"><img src="/img/gmap-pin.png" alt=""> {{ task.location }}</span>
          </div>
        </div>
      </div>
      <div class="carte grande">
        <span class="map-titre">Location</span>
        <iframe v-if="selectedTask != null" :src="getMapUrl(selectedTask.location)"></iframe>
        <iframe v-else src="https://maps.google.com/maps?q=Paris&z=11&output=embed"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { getMapUrl } from '../utils.js'

export default {
  props: ['tasks'],

  data() {
    return {
      mapTask: null
    }
  },

  computed: {
    tasksWithLocation() {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].location != '') {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    selectedTask() {
      if (this.mapTask != null) {
        return this.mapTask
      }
      if (this.tasksWithLocation.length > 0) {
        return this.tasksWithLocation[0]
      }
      return null
    }
  },

  methods: {
    getMapUrl
  }
}
</script>
