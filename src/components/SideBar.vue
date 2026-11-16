<template>
  <div class="gauche">
    <aside class="sidebar">
      <div class="logo">
        <img src="/img/logo.png" alt="MyList Maker logo">
        <span>MyList<br>Maker</span>
      </div>

      <div class="cases">
        <router-link to="/filter/scheduled" class="case">
          <div class="case-top"><span class="rond rouge"><img src="/img/ic-calendar.svg" alt=""></span><b>{{ scheduledCount }}</b></div>
          <p>Scheduled</p>
        </router-link>
        <router-link to="/filter/flagged" class="case">
          <div class="case-top"><span class="rond orange"><img src="/img/ic-flag.svg" alt=""></span><b>{{ flaggedCount }}</b></div>
          <p>Flagged</p>
        </router-link>
        <router-link to="/filter/today" class="case">
          <div class="case-top"><span class="rond bleu"><img src="/img/ic-clock.svg" alt=""></span><b>{{ todayCount }}</b></div>
          <p>Today</p>
        </router-link>
        <router-link to="/filter/all" class="case">
          <div class="case-top"><span class="rond gris-fonce"><img src="/img/ic-inbox.svg" alt=""></span><b>{{ tasks.length }}</b></div>
          <p>All</p>
        </router-link>
      </div>

      <h3>My Lists</h3>
      <div class="mes-listes">
        <router-link v-for="list in lists" :key="list.id" :to="'/list/' + list.id" class="une-liste" :class="{ selected: currentListId == list.id }">
          <span class="rond" :style="{ backgroundColor: list.color }"><img src="/img/list-icon.svg" alt=""></span>
          <span class="nom">{{ list.name }}</span>
          <span class="nb">{{ countTasksOfList(list.id) }} to do</span>
        </router-link>
      </div>

      <div class="add-list" v-if="showAddList == false">
        <a href="#" @click.prevent="showAddList = true">+ Add a list</a>
      </div>
      <div class="add-list ouvert" v-else>
        <p v-if="errorMessage" class="sidebar-erreur">{{ errorMessage }}</p>
        <input type="text" v-model="newListName" placeholder="Name of the list" @input="errorMessage = ''">
        <div class="add-list-bas">
          <select v-model="newListColor">
            <option value="#e74c3c">Red</option>
            <option value="#3498db">Blue</option>
            <option value="#2ecc71">Green</option>
            <option value="#f39c12">Orange</option>
            <option value="#9b59b6">Purple</option>
            <option value="#1d2b6b">Navy</option>
          </select>
          <button class="pill" @click="addList()">Add</button>
          <button class="pill gris" @click="cancelAddList()">Cancel</button>
        </div>
      </div>
    </aside>

    <nav class="menu-bas">
      <router-link to="/" title="Home">
        <img v-if="$route.name == 'home'" src="/img/nav-home-bold.svg" alt="Home">
        <img v-else src="/img/nav-home.svg" alt="Home">
      </router-link>
      <router-link to="/calendar" title="Calendar">
        <img v-if="$route.name == 'calendar'" src="/img/nav-calendar-bold.svg" alt="Calendar">
        <img v-else src="/img/nav-calendar.svg" alt="Calendar">
      </router-link>
      <router-link to="/map" title="Location">
        <img v-if="$route.name == 'map'" src="/img/nav-pin-bold.svg" alt="Location">
        <img v-else src="/img/nav-pin.svg" alt="Location">
      </router-link>
      <router-link to="/settings" title="Settings">
        <img v-if="$route.name == 'settings'" src="/img/nav-settings-bold.svg" alt="Settings">
        <img v-else src="/img/nav-settings.svg" alt="Settings">
      </router-link>
    </nav>
  </div>
</template>

<script>
import { getFlaggedTasks, getScheduledTasks, getTodayTasks } from '../utils.js'

export default {
  props: ['lists', 'tasks', 'currentListId'],
  emits: ['add-list'],

  data() {
    return {
      showAddList: false,
      newListName: '',
      newListColor: '#3498db',
      errorMessage: ''
    }
  },

  computed: {
    scheduledCount() {
      return getScheduledTasks(this.tasks).length
    },

    flaggedCount() {
      return getFlaggedTasks(this.tasks).length
    },

    todayCount() {
      return getTodayTasks(this.tasks).length
    }
  },

  methods: {
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
      if (this.newListName.trim() == '') {
        this.errorMessage = 'Give a name to your list'
        return
      }
      this.errorMessage = ''
      this.$emit('add-list', this.newListName.trim(), this.newListColor)
      this.newListName = ''
      this.showAddList = false
    },

    cancelAddList() {
      this.showAddList = false
      this.newListName = ''
      this.errorMessage = ''
    }
  }
}
</script>
