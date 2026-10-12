<template>
  <div>
    <h1>Location</h1>
    <div class="page-map">
      <div class="liste-lieux">
        <p v-if="getTasksWithLocation().length == 0" class="vide">No task with a location</p>
        <div v-for="task in getTasksWithLocation()" :key="task.id" class="task" :class="{ selected: mapSearch == task.location }" @click="mapSearch = task.location">
          <div class="task-text">
            <span>{{ task.title }}</span>
            <span class="lieu"><img src="/img/pin.svg" class="mini-icone"> {{ task.location }}</span>
          </div>
        </div>
      </div>
      <iframe class="grande-map" :src="getMapUrl(mapSearch)"></iframe>
    </div>
  </div>
</template>

<script>
import { getMapUrl } from '../utils.js'

export default {
  props: ['tasks'],

  data() {
    return {
      mapSearch: 'Montreal'
    }
  },

  methods: {
    getMapUrl,

    getTasksWithLocation() {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].location != '') {
          result.push(this.tasks[i])
        }
      }
      return result
    }
  }
}
</script>
