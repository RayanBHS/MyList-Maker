<template>
  <div class="login-page">
    <div class="login-logo">
      <img src="/img/logo.png" alt="MyList Maker logo">
      <span>MyList<br>Maker</span>
    </div>

    <form class="login-box" @submit.prevent="submit()">
      <input type="text" v-model="username" placeholder="Account">
      <input type="email" v-model="email" placeholder="Email" v-if="mode == 'register'">
      <input type="password" v-model="password" placeholder="Password">
      <input type="password" v-model="password2" placeholder="Confirm password" v-if="mode == 'register'">

      <p class="login-erreur" v-if="error != ''">{{ error }}</p>

      <div class="login-bas">
        <a href="#" v-if="mode == 'login'" @click.prevent="changeMode('register')">+ Create new account</a>
        <a href="#" v-else @click.prevent="changeMode('login')">&lt; Back to login</a>
        <button type="submit" class="connect" :disabled="loading">
          {{ mode == 'login' ? 'Connect' : 'Sign up' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { login, register } from '../api.js'

export default {
  emits: ['logged'],

  data() {
    return {
      mode: 'login',
      username: '',
      email: '',
      password: '',
      password2: '',
      error: '',
      loading: false
    }
  },

  methods: {
    changeMode(mode) {
      this.mode = mode
      this.error = ''
      this.password = ''
      this.password2 = ''
    },

    async submit() {
      this.error = ''

      if (this.username == '' || this.password == '') {
        this.error = 'Fill your account and your password'
        return
      }
      if (this.mode == 'register') {
        if (this.email == '') {
          this.error = 'Fill your email'
          return
        }
        if (this.password.length < 6) {
          this.error = 'The password needs at least 6 characters'
          return
        }
        if (this.password != this.password2) {
          this.error = 'The two passwords are not the same'
          return
        }
      }

      this.loading = true
      try {
        let user
        if (this.mode == 'login') {
          user = await login(this.username, this.password)
        } else {
          user = await register(this.username, this.email, this.password)
        }
        this.$emit('logged', user.username)
      } catch (e) {
        this.error = e.message
      }
      this.loading = false
    }
  }
}
</script>