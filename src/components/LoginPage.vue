<template>
  <div class="login-page">
    <div class="login-box">
      <img src="/img/logo.svg" class="login-logo" alt="logo">
      <h1>MyList Maker</h1>

      <div v-if="showRegister == false">
        <h2>Login</h2>
        <input type="text" v-model="username" placeholder="Username">
        <input type="password" v-model="password" placeholder="Password">
        <p class="error" v-if="error != ''">{{ error }}</p>
        <button class="btn" @click="login()">Log in</button>
        <p class="small">No account ? <a href="#" @click="openRegister()">Create one</a></p>
      </div>

      <div v-else>
        <h2>Register</h2>
        <input type="text" v-model="username" placeholder="Username">
        <input type="password" v-model="password" placeholder="Password">
        <input type="password" v-model="password2" placeholder="Confirm password">
        <p class="error" v-if="error != ''">{{ error }}</p>
        <button class="btn" @click="register()">Create account</button>
        <p class="small">Already have an account ? <a href="#" @click="showRegister = false">Log in</a></p>
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
