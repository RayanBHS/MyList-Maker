// Tous les appels vers le serveur Node.js (voir server/).
// Le token de connexion est gardé dans le localStorage pour rester connecté après un refresh.

const TOKEN_KEY = 'mylist-token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// fonction de base : envoie la requete et renvoie le JSON
// si le serveur répond avec une erreur, on lance une Error avec son message
async function request(method, url, body) {
  let headers = { 'Content-Type': 'application/json' }
  let token = getToken()
  if (token) {
    headers.Authorization = 'Bearer ' + token
  }

  let response
  try {
    response = await fetch('/api' + url, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined
    })
  } catch (e) {
    throw new Error('Cannot reach the server. Is "npm run server" running ?')
  }

  let data = await response.json().catch(() => ({}))
  if (response.ok == false) {
    // notre API répond toujours avec { error: ... } : sans ça, c'est que Vite n'a pas pu la joindre
    if (data.error == undefined && response.status >= 500) {
      data.error = 'Cannot reach the API. Is "npm run server" running ?'
    }
    let error = new Error(data.error || 'Server error')
    error.status = response.status
    throw error
  }
  return data
}

// ----- compte -----
export async function login(username, password) {
  let data = await request('POST', '/auth/login', { username: username, password: password })
  setToken(data.token)
  return data.user
}

export async function register(username, email, password) {
  let data = await request('POST', '/auth/register', { username: username, email: email, password: password })
  setToken(data.token)
  return data.user
}

export async function logout() {
  try {
    await request('POST', '/auth/logout')
  } catch (e) {
    // pas grave : on supprime quand meme le token chez nous
  }
  clearToken()
}

export function getMe() {
  return request('GET', '/auth/me')
}

// ----- listes -----
export function getLists() {
  return request('GET', '/lists')
}

export function createList(name, color) {
  return request('POST', '/lists', { name: name, color: color })
}

export function deleteList(id) {
  return request('DELETE', '/lists/' + id)
}

// ----- taches -----
export function getTasks() {
  return request('GET', '/tasks')
}

export function createTask(listId, title) {
  return request('POST', '/tasks', { listId: listId, title: title })
}

export function updateTask(task) {
  return request('PUT', '/tasks/' + task.id, {
    title: task.title,
    description: task.description,
    date: task.date,
    location: task.location,
    status: task.status,
    flagged: task.flagged
  })
}

export function deleteTask(id) {
  return request('DELETE', '/tasks/' + id)
}
