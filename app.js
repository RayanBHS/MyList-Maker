Vue.createApp({
  data() {
    return {
      isLogged: false,
      showRegister: false,
      loginUsername: '',
      loginPassword: '',
      loginPassword2: '',
      loginError: '',
      currentUser: '',

      page: 'home',
      currentListId: null,
      currentTask: null,
      filter: 'all',

      lists: [],
      tasks: [],

      showAddList: false, // affiche formulaire ajout liste
      newListName: '',
      newListColor: '#3498db',
      newTaskTitle: '',

      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

      mapSearch: 'Montreal'
    }
  },

  mounted() {
    let user = localStorage.getItem('currentUser')
    if (user != null) {
      this.currentUser = user
      this.isLogged = true
      this.loadData()
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

    login() {
      this.loginError = ''
      if (this.loginUsername == '' || this.loginPassword == '') {
        this.loginError = 'Please fill all the fields'
        return
      }
      let users = this.getUsers()
      let found = false
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == this.loginUsername && users[i].password == this.loginPassword) {
          found = true
        }
      }
      if (found == false) {
        this.loginError = 'Wrong username or password'
        return
      }
      localStorage.setItem('currentUser', this.loginUsername)
      this.currentUser = this.loginUsername
      this.isLogged = true
      this.loginPassword = ''
      this.loadData()
    },

    register() {
      this.loginError = ''
      if (this.loginUsername == '' || this.loginPassword == '') {
        this.loginError = 'Please fill all the fields'
        return
      }
      if (this.loginPassword.length < 6) {
        this.loginError = 'Password must be at least 6 characters'
        return
      }
      if (this.loginPassword != this.loginPassword2) {
        this.loginError = 'The passwords are not the same'
        return
      }
      let users = this.getUsers()
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == this.loginUsername) {
          this.loginError = 'This username is already taken'
          return
        }
      }
      users.push({ username: this.loginUsername, password: this.loginPassword })
      localStorage.setItem('users', JSON.stringify(users))
      this.showRegister = false
      this.loginPassword2 = ''
      this.login()
    },

    logout() {
      localStorage.removeItem('currentUser')
      this.isLogged = false
      this.currentUser = ''
      this.loginUsername = ''
      this.lists = []
      this.tasks = []
      this.page = 'home'
      this.currentTask = null
    },

    loadData() {
      let data = JSON.parse(localStorage.getItem('data_' + this.currentUser))
      if (data == null) {
        let today = this.dateToString(new Date())
        this.lists = [
          { id: 1, name: 'Web\'s Work', color: '#3498db' },
          { id: 2, name: 'Toronto Trip', color: '#e74c3c' },
          { id: 3, name: 'Chores', color: '#2ecc71' }
        ]
        this.tasks = [
          { id: 1, listId: 1, title: 'Starting Project', description: 'Do the milestone 1 and choose the subject of the project with the team', date: today, location: 'Concordia University', status: 'doing', flagged: true },
          { id: 2, listId: 1, title: 'First step of work', description: '', date: '', location: '', status: 'todo', flagged: false },
          { id: 3, listId: 1, title: 'Work together at Concordia', description: '', date: '', location: 'Concordia University', status: 'todo', flagged: false },
          { id: 4, listId: 1, title: 'New ideas for the project', description: '', date: '', location: '', status: 'done', flagged: false },
          { id: 5, listId: 2, title: 'Go to the Niagara falls', description: 'Take the bus from Toronto', date: '', location: 'Niagara Falls', status: 'todo', flagged: true },
          { id: 6, listId: 2, title: 'Return to Paris', description: '', date: '', location: 'Paris', status: 'todo', flagged: true },
          { id: 7, listId: 3, title: 'Do the groceries', description: 'milk, eggs, bread', date: today, location: '', status: 'todo', flagged: false }
        ]
        this.save()
      } else {
        this.lists = data.lists
        this.tasks = data.tasks
      }
    },

    save() {
      let data = { lists: this.lists, tasks: this.tasks }
      localStorage.setItem('data_' + this.currentUser, JSON.stringify(data))
    },

    resetData() {
      if (confirm('Are you sure ? Everything will be deleted')) {
        localStorage.removeItem('data_' + this.currentUser)
        this.loadData()
        this.page = 'home'
      }
    },

    openList(id) {
      this.currentListId = id
      this.currentTask = null
      this.page = 'list'
    },

    addList() {
      if (this.newListName == '') {
        alert('Give a name to your list')
        return
      }
      let newId = 1
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id >= newId) {
          newId = this.lists[i].id + 1
        }
      }
      this.lists.push({ id: newId, name: this.newListName, color: this.newListColor })
      this.newListName = ''
      this.showAddList = false
      this.save()
      this.openList(newId)
    },

    deleteList(id) {
      if (confirm('Delete this list and all its tasks ?') == false) {
        return
      }
      let newLists = []
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id != id) {
          newLists.push(this.lists[i])
        }
      }
      let newTasks = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].listId != id) {
          newTasks.push(this.tasks[i])
        }
      }
      this.lists = newLists
      this.tasks = newTasks
      this.save()
      this.page = 'home'
    },

    getListName(id) {
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id == id) {
          return this.lists[i].name
        }
      }
      return ''
    },

    getListColor(id) {
      for (let i = 0; i < this.lists.length; i++) {
        if (this.lists[i].id == id) {
          return this.lists[i].color
        }
      }
      return 'grey'
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

    addTask() {
      if (this.newTaskTitle == '') {
        return
      }
      let newId = 1
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id >= newId) {
          newId = this.tasks[i].id + 1
        }
      }
      this.tasks.push({
        id: newId,
        listId: this.currentListId,
        title: this.newTaskTitle,
        description: '',
        date: '',
        location: '',
        status: 'todo',
        flagged: false
      })
      this.newTaskTitle = ''
      this.save()
    },

    deleteTask(task) {
      let newTasks = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id != task.id) {
          newTasks.push(this.tasks[i])
        }
      }
      this.tasks = newTasks
      this.currentTask = null
      this.save()
    },

    openTask(task) {
      this.currentListId = task.listId
      this.page = 'list'
      this.currentTask = task
    },

    checkTask(task) {
      if (task.status == 'done') {
        task.status = 'todo'
      } else {
        task.status = 'done'
      }
      this.save()
    },

    changeStatus(task, status) {
      task.status = status
      this.save()
    },

    toggleFlag(task) {
      if (task.flagged == true) {
        task.flagged = false
      } else {
        task.flagged = true
      }
      this.save()
    },

    getTasksByStatus(status) {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].listId == this.currentListId && this.tasks[i].status == status) {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    getNextTasks() {
      let withDate = []
      let withoutDate = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].status != 'done') {
          if (this.tasks[i].date != '') {
            withDate.push(this.tasks[i])
          } else {
            withoutDate.push(this.tasks[i])
          }
        }
      }
      for (let i = 0; i < withDate.length; i++) {
        for (let j = 0; j < withDate.length - 1; j++) {
          if (withDate[j].date > withDate[j + 1].date) {
            let temp = withDate[j]
            withDate[j] = withDate[j + 1]
            withDate[j + 1] = temp
          }
        }
      }
      let result = []
      for (let i = 0; i < withDate.length; i++) {
        result.push(withDate[i])
      }
      for (let i = 0; i < withoutDate.length; i++) {
        result.push(withoutDate[i])
      }
      let firstSix = []
      for (let i = 0; i < result.length && i < 6; i++) {
        firstSix.push(result[i])
      }
      return firstSix
    },

    getFlaggedTasks() {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].flagged == true && this.tasks[i].status != 'done') {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    getScheduledTasks() {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].date != '' && this.tasks[i].status != 'done') {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    getTodayTasks() {
      let today = this.dateToString(new Date())
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].date == today && this.tasks[i].status != 'done') {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    getTasksWithLocation() {
      let result = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].location != '') {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    countScheduled() {
      return this.getScheduledTasks().length
    },

    countFlagged() {
      return this.getFlaggedTasks().length
    },

    countToday() {
      return this.getTodayTasks().length
    },

    openFilter(f) {
      this.filter = f
      this.currentTask = null
      this.page = 'filter'
    },

    filterTitle() {
      if (this.filter == 'scheduled') {
        return 'Scheduled'
      }
      if (this.filter == 'flagged') {
        return 'Flagged'
      }
      if (this.filter == 'today') {
        return 'Today'
      }
      return 'All'
    },

    getFilteredTasks() {
      if (this.filter == 'scheduled') {
        return this.getScheduledTasks()
      }
      if (this.filter == 'flagged') {
        return this.getFlaggedTasks()
      }
      if (this.filter == 'today') {
        return this.getTodayTasks()
      }
      return this.tasks
    },

    getDaysOfMonth() {
      let days = []
      let firstDay = new Date(this.year, this.month, 1).getDay()
      if (firstDay == 0) {
        firstDay = 7
      }
      for (let i = 1; i < firstDay; i++) {
        days.push(0)
      }
      let nbDays = new Date(this.year, this.month + 1, 0).getDate()
      for (let i = 1; i <= nbDays; i++) {
        days.push(i)
      }
      return days
    },

    getTasksOfDay(day) {
      let result = []
      if (day == 0) {
        return result
      }
      let date = this.dateToString(new Date(this.year, this.month, day))
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].date == date) {
          result.push(this.tasks[i])
        }
      }
      return result
    },

    isToday(day) {
      let d = new Date()
      if (day == d.getDate() && this.month == d.getMonth() && this.year == d.getFullYear()) {
        return true
      }
      return false
    },

    previousMonth() {
      this.month = this.month - 1
      if (this.month < 0) {
        this.month = 11
        this.year = this.year - 1
      }
    },

    nextMonth() {
      this.month = this.month + 1
      if (this.month > 11) {
        this.month = 0
        this.year = this.year + 1
      }
    },

    dateToString(d) {
      let m = d.getMonth() + 1
      let j = d.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (j < 10) {
        j = '0' + j
      }
      return d.getFullYear() + '-' + m + '-' + j
    },

    formatDate(date) {
      let parts = date.split('-')
      return parts[2] + '/' + parts[1] + '/' + parts[0]
    },

    getMapUrl(place) {
      return 'https://maps.google.com/maps?q=' + place + '&z=13&output=embed'
    }
  }
}).mount('#app')
