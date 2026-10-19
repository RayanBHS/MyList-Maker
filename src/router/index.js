import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import ListPage from '../views/ListPage.vue'
import FilterPage from '../views/FilterPage.vue'
import CalendarPage from '../views/CalendarPage.vue'
import MapPage from '../views/MapPage.vue'
import SettingsPage from '../views/SettingsPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/list/:id', name: 'list', component: ListPage },
  { path: '/filter/:filter', name: 'filter', component: FilterPage },
  { path: '/calendar', name: 'calendar', component: CalendarPage },
  { path: '/map', name: 'map', component: MapPage },
  { path: '/settings', name: 'settings', component: SettingsPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
