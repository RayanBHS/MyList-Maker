<template>
  <div>
    <h1>Settings</h1>
    <div class="bloc">
      <p>Logged as : <b>{{ currentUser }}</b></p>
      <button class="btn" @click="$emit('logout')">Log out</button>
      <button class="btn red" @click="$emit('reset')">Delete all my data</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentUser'],
  emits: ['logout', 'reset']
}
</script>
