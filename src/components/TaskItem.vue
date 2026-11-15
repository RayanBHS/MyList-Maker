<template>
  <div
    class="task"
    :class="{ selected: selected, done: task.status == 'done' }"
    @click="$emit('open-task', task)"
  >
    <button
      v-if="showCheck"
      class="check"
      :class="{ coche: task.status == 'done' }"
      @click.stop="$emit('check-task', task)"
    ></button>

    <div class="task-text">
      <span class="task-titre">{{ task.title }}</span>
      <span class="task-date" v-if="showDate && task.date != ''">{{ formatDate(task.date) }}</span>
      <span class="chip" v-if="task.location != ''">
        <img src="/img/gmap-pin.png" alt=""> Go to {{ task.location }}
      </span>
    </div>

    <img v-if="task.flagged" src="/img/flag.svg" class="task-flag" alt="flagged">

    <span
      v-if="showCircle && lists"
      class="rond"
      :style="{ backgroundColor: getListColor(lists, task.listId) }"
    >
      <img src="/img/list-icon.svg" alt="">
    </span>

    <span
      v-if="showTag && lists"
      class="tag"
      :style="{ backgroundColor: getListColor(lists, task.listId) }"
    >
      {{ getListName(lists, task.listId) }}
    </span>

    <slot></slot>
  </div>
</template>

<script>
import { formatDate, getListColor, getListName } from '../utils.js'

export default {
  props: {
    task: {
      type: Object,
      required: true
    },
    lists: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Boolean,
      default: false
    },
    showCheck: {
      type: Boolean,
      default: true
    },
    showDate: {
      type: Boolean,
      default: true
    },
    showCircle: {
      type: Boolean,
      default: false
    },
    showTag: {
      type: Boolean,
      default: false
    }
  },

  emits: ['open-task', 'check-task'],

  methods: {
    formatDate,
    getListColor,
    getListName
  }
}
</script>
