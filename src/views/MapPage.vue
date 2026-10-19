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
      <div class="map-construction grande">
        <img src="/img/pin.svg" alt="">
        <h2>Map in construction</h2>
        <p>We are still working on the map, it will show where your tasks are.</p>
        <p v-if="mapSearch != ''">Selected place : <b>{{ mapSearch }}</b></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tasks'],

  data() {
    return {
      mapSearch: ''
    }
  },

  methods: {
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
