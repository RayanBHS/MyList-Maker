<template>
  <div>
    <h1>Settings</h1>
    <div class="bloc reglages">
      <img src="/img/logo.png" alt="">
      <div>
        <p class="reglages-label">Logged as</p>
        <p class="reglages-nom">{{ currentUser }}</p>
      </div>
      <button class="connect petit" @click="$emit('logout')">Log out</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentUser'],
  emits: ['logout']
}
</script>
