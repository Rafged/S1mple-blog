
const API_URL = '/api';

export function getToken() {
  return localStorage.getItem('token');
}
export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

async function request(path, method='GET', body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = 'Token ' + token;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null } catch(e) { data = text }
  if (!res.ok) {
    const err = new Error('API Error: ' + res.status);
    err.response = data;
    throw err;
  }
  return data;
}

// Auth
export const AuthAPI = {
  login: (credentials) => request('/users/login', 'POST', { user: credentials }),
  register: (user) => request('/users', 'POST', { user }),
  current: () => request('/user'),
  update: (user) => request('/user', 'PUT', { user }),
}

// Articles
export const ArticlesAPI = {
  list: (page=0, limit=10) => request(`/articles?limit=${limit}&offset=${page*limit}`),
  feed: (page=0,limit=10) => request(`/articles/feed?limit=${limit}&offset=${page*limit}`),
  get: (slug) => request(`/articles/${slug}`),
  create: (article) => request('/articles', 'POST', { article }),
  favorite: (slug) => request(`/articles/${slug}/favorite`, 'POST'),
  unfavorite: (slug) => request(`/articles/${slug}/favorite`, 'DELETE'),
}

// Profile
export const ProfileAPI = {
  get: (username) => request(`/profiles/${username}`)
}
