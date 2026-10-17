export function dateToString(d) {
  let m = d.getMonth() + 1
  let j = d.getDate()
  if (m < 10) {
    m = '0' + m
  }
  if (j < 10) {
    j = '0' + j
  }
  return d.getFullYear() + '-' + m + '-' + j
}

export function formatDate(date) {
  let parts = date.split('-')
  return parts[2] + '/' + parts[1] + '/' + parts[0]
}

export function getListName(lists, id) {
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].id == id) {
      return lists[i].name
    }
  }
  return ''
}

export function getListColor(lists, id) {
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].id == id) {
      return lists[i].color
    }
  }
  return 'grey'
}

export function getFlaggedTasks(tasks) {
  let result = []
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].flagged == true && tasks[i].status != 'done') {
      result.push(tasks[i])
    }
  }
  return result
}

export function getScheduledTasks(tasks) {
  let result = []
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].date != '' && tasks[i].status != 'done') {
      result.push(tasks[i])
    }
  }
  return result
}

export function getTodayTasks(tasks) {
  let today = dateToString(new Date())
  let result = []
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].date == today && tasks[i].status != 'done') {
      result.push(tasks[i])
    }
  }
  return result
}
