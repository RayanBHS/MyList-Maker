<template>
  <div class="gauche">
    <div class="sidebar">
      <div class="logo">
        <img src="/img/logo.png" alt="logo">
        <span>MyList<br>Maker</span>
      </div>

      <div class="cases">
        <div class="case" @click="$emit('open-filter', 'scheduled')">
          <div class="case-top"><img src="/img/calendar.svg" class="icone"><b>{{ countScheduled() }}</b></div>
          <p>Scheduled</p>
        </div>
        <div class="case" @click="$emit('open-filter', 'flagged')">
          <div class="case-top"><img src="/img/flag.svg" class="icone"><b>{{ countFlagged() }}</b></div>
          <p>Flagged</p>
        </div>
        <div class="case" @click="$emit('open-filter', 'today')">
          <div class="case-top"><img src="/img/clock.svg" class="icone"><b>{{ countToday() }}</b></div>
          <p>Today</p>
        </div>
        <div class="case" @click="$emit('open-filter', 'all')">
          <div class="case-top"><img src="/img/inbox.svg" class="icone"><b>{{ tasks.length }}</b></div>
          <p>All</p>
        </div>
      </div>

      <h3>My Lists</h3>
      <div class="mes-listes">
        <div v-for="list in lists" :key="list.id" class="une-liste" :class="{ selected: page == 'list' && currentListId == list.id }" @click="$emit('open-list', list.id)">
          <span class="rond" :style="{ backgroundColor: list.color }"></span>
          <span>{{ list.name }}</span>
          <span class="nb">{{ countTasksOfList(list.id) }}</span>
        </div>
      </div>

      <div class="add-list" v-if="showAddList == false">
        <a href="#" @click="showAddList = true">+ Add a list</a>
      </div>
      <div class="add-list" v-else>
        <input type="text" v-model="newListName" placeholder="Name of the list">
        <select v-model="newListColor">
          <option value="#e74c3c">Red</option>
          <option value="#3498db">Blue</option>
          <option value="#2ecc71">Green</option>
          <option value="#f39c12">Orange</option>
          <option value="#9b59b6">Purple</option>
        </select>
        <button class="btn-small" @click="addList()">Add</button>
        <button class="btn-small grey" @click="showAddList = false">Cancel</button>
      </div>
    </div>

    <div class="menu-bas">
      <button @click="$emit('change-page', 'home')" title="Home">
        <img v-if="page == 'home'" src="/img/nav-home-bold.svg">
        <img v-else src="/img/nav-home.svg">
      </button>
      <button @click="$emit('change-page', 'calendar')" title="Calendar">
        <img v-if="page == 'calendar'" src="/img/nav-calendar-bold.svg">
        <img v-else src="/img/nav-calendar.svg">
      </button>
      <button @click="$emit('change-page', 'map')" title="Location">
        <img v-if="page == 'map'" src="/img/nav-pin-bold.svg">
        <img v-else src="/img/nav-pin.svg">
      </button>
      <button @click="$emit('change-page', 'settings')" title="Settings">
        <img v-if="page == 'settings'" src="/img/nav-settings-bold.svg">
        <img v-else src="/img/nav-settings.svg">
      </button>
    </div>
  </div>
</template>

<script>
import { getFlaggedTasks, getScheduledTasks, getTodayTasks } from '../utils.js'

export default {
  props: ['lists', 'tasks', 'page', 'currentListId'],
  emits: ['open-filter', 'open-list', 'add-list', 'change-page'],

  data() {
    return {
      showAddList: false,
      newListName: '',
      newListColor: '#3498db'
    }
  },

  methods: {
    countScheduled() {
      return getScheduledTasks(this.tasks).length
    },

    countFlagged() {
      return getFlaggedTasks(this.tasks).length
    },

    countToday() {
      return getTodayTasks(this.tasks).length
    },

    countTasksOfList(id) {
      let nb = 0
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].listId == id && this.tasks[i].status != 'done') {
          nb++
        }
      }
      return nb
    },

    addList() {
      if (this.newListName == '') {
        alert('Give a name to your list')
        return
      }
      this.$emit('add-list', this.newListName, this.newListColor)
      this.newListName = ''
      this.showAddList = false
    }
  }
}
</script>
