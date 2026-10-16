<template>
  <div class="login-page">
    <div class="login-logo">
      <img src="/img/logo.png" alt="MyList Maker logo">
      <span>MyList<br>Maker</span>
    </div>

    <form class="login-box" @submit.prevent="connect()">
      <input type="text" v-model="username" placeholder="Account">
      <input type="password" v-model="password" placeholder="Password">
      <div class="login-bas">
        <a href="#">+ Create new account</a>
        <button type="submit" class="connect">Connect</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  emits: ['logged'],

  data() {
    return {
      username: '',
      password: ''
    }
  },

  methods: {
    connect() {
      this.$emit('logged', this.username)
    }
  }
}
</script>
