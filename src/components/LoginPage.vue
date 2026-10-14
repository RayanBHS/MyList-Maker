<template>
  <div class="login-page">
    <div class="login-logo">
      <img src="/img/logo.png" alt="logo">
      <span>MyList<br>Maker</span>
    </div>

    <div class="login-box" v-if="showRegister == false">
      <input type="text" v-model="username" placeholder="Account">
      <input type="password" v-model="password" placeholder="Password">
      <p class="error" v-if="error != ''">{{ error }}</p>
      <div class="login-bas">
        <a href="#" @click="openRegister()">+ Create new account</a>
        <button class="connect" @click="login()">Connect</button>
      </div>
    </div>

    <div class="login-box" v-else>
      <input type="text" v-model="username" placeholder="Account">
      <input type="password" v-model="password" placeholder="Password">
      <input type="password" v-model="password2" placeholder="Confirm password">
      <p class="error" v-if="error != ''">{{ error }}</p>
      <div class="login-bas">
        <a href="#" @click="openLogin()">I already have an account</a>
        <button class="connect" @click="register()">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['logged'],

  data() {
    return {
      showRegister: false,
      username: '',
      password: '',
      password2: '',
      error: ''
    }
  },

  methods: {
    getUsers() {
      let users = JSON.parse(localStorage.getItem('users'))
      if (users == null) {
        users = []
      }
      return users
    },

    openRegister() {
      this.showRegister = true
      this.error = ''
    },

    openLogin() {
      this.showRegister = false
      this.error = ''
    },

    login() {
      this.error = ''
      if (this.username == '' || this.password == '') {
        this.error = 'Please fill all the fields'
        return
      }
      let users = this.getUsers()
      let found = false
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == this.username && users[i].password == this.password) {
          found = true
        }
      }
      if (found == false) {
        this.error = 'Wrong username or password'
        return
      }
      this.$emit('logged', this.username)
    },

    register() {
      this.error = ''
      if (this.username == '' || this.password == '') {
        this.error = 'Please fill all the fields'
        return
      }
      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters'
        return
      }
      if (this.password != this.password2) {
        this.error = 'The passwords are not the same'
        return
      }
      let users = this.getUsers()
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == this.username) {
          this.error = 'This username is already taken'
          return
        }
      }
      users.push({ username: this.username, password: this.password })
      localStorage.setItem('users', JSON.stringify(users))
      this.$emit('logged', this.username)
    }
  }
}
</script>
