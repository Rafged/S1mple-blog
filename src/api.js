const API = '/api'

function getToken(){
  return localStorage.getItem('token')
}

function authHeaders(){
  const t = getToken()
  return t ? { 'Authorization': 'Token ' + t } : {}
}

async function request(path, opts = {}){
  const headers = { 'Content-Type': 'application/json', ...(opts.headers||{}), ...authHeaders() }
  const res = await fetch(API + path, {...opts, headers})
  const text = await res.text()
  let body = null
  try { body = text ? JSON.parse(text) : {} } catch(e){ body = {raw: text} }
  if(!res.ok) throw { status: res.status, body }
  return body
}

export async function getArticles(query=''){
  return request('/articles' + (query||''))
}

export async function getArticle(slug){
  return request('/articles/' + slug)
}

export async function favoriteArticle(slug){
  return request('/articles/' + slug + '/favorite', { method: 'POST' })
}
export async function unfavoriteArticle(slug){
  return request('/articles/' + slug + '/favorite', { method: 'DELETE' })
}

export async function getTags(){ return request('/tags') }

export async function login(email, password){ return request('/users/login', { method:'POST', body: JSON.stringify({user:{email, password}}) }) }
export async function register(username,email,password){ return request('/users', { method:'POST', body: JSON.stringify({user:{username,email,password}}) }) }
export async function getCurrentUser(){ return request('/user') }
export async function updateUser(payload){ return request('/user', { method:'PUT', body: JSON.stringify({user: payload}) }) }

export async function createArticle(article){ return request('/articles', { method:'POST', body: JSON.stringify({article}) }) }
export async function getArticlesByAuthor(author){ return request('/articles?author=' + encodeURIComponent(author)) }
