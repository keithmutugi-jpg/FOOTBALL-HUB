import db from '../../server/data/db.json'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const STATIC_SESSION_KEY = 'football_hub_static_session'

function buildUser(provider, email) {
  if (provider === 'github') {
    return {
      id: 'github-1',
      name: 'Football Fan',
      email: email || 'fan@github.com',
      provider: 'github',
      avatar: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=256&q=80',
      favorites: [],
    }
  }

  if (provider === 'google') {
    return {
      id: 'google-1',
      name: 'Football Fan',
      email: email || 'fan@google.com',
      provider: 'google',
      avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=256&q=80',
      favorites: [],
    }
  }

  return {
    id: `user-${email}`,
    name: email.split('@')[0],
    email,
    provider: 'local',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    favorites: [],
  }
}

function getStaticSession() {
  const saved = window.localStorage.getItem(STATIC_SESSION_KEY)
  return saved ? JSON.parse(saved) : null
}

function saveStaticSession(session) {
  window.localStorage.setItem(STATIC_SESSION_KEY, JSON.stringify(session))
}

function getFavoriteTeams(favorites = []) {
  return favorites.map((id) => db.teams.find((team) => team.id === id)).filter(Boolean)
}

async function staticRequest(path, options = {}) {
  const method = options.method || 'GET'
  const body = options.body ? JSON.parse(options.body) : {}
  const session = getStaticSession()

  if (method === 'GET' && path === '/session') {
    return { user: session?.user ? { ...session.user, favorites: session.favorites || [] } : null }
  }

  if (method === 'GET' && path === '/profile') {
    if (!session) throw new Error('Not authenticated')
    return { user: { ...session.user, favorites: session.favorites || [] } }
  }

  if (method === 'POST' && path === '/auth/login') {
    if (!body.email || !body.password) {
      throw new Error('Email and password are required.')
    }
    const nextSession = { user: buildUser('local', body.email), favorites: [] }
    saveStaticSession(nextSession)
    return { user: { ...nextSession.user, favorites: nextSession.favorites } }
  }

  if (method === 'POST' && path === '/auth/social') {
    if (!['github', 'google'].includes(body.provider)) {
      throw new Error('Invalid social provider.')
    }
    const nextSession = { user: buildUser(body.provider), favorites: [] }
    saveStaticSession(nextSession)
    return { user: { ...nextSession.user, favorites: nextSession.favorites } }
  }

  if (method === 'POST' && path === '/auth/logout') {
    window.localStorage.removeItem(STATIC_SESSION_KEY)
    return { success: true }
  }

  if (method === 'GET' && path.startsWith('/matches')) {
    const limit = new URLSearchParams(path.split('?')[1] || '').get('limit')
    return db.matches.slice(0, limit ? Number(limit) : db.matches.length)
  }

  if (method === 'GET' && path.startsWith('/standings')) {
    const limit = new URLSearchParams(path.split('?')[1] || '').get('limit')
    return db.standings.slice(0, limit ? Number(limit) : db.standings.length)
  }

  if (method === 'GET' && path === '/teams') return db.teams
  if (method === 'GET' && path === '/players') return { players: db.players }

  if (method === 'GET' && path === '/favorites') {
    if (!session) throw new Error('Unauthorized')
    return { favorites: getFavoriteTeams(session.favorites) }
  }

  if (method === 'PATCH' && path === '/favorites') {
    if (!session) throw new Error('Unauthorized')
    if (!body.teamId) throw new Error('Team id required.')

    const favorites = session.favorites || []
    const nextFavorites = favorites.includes(body.teamId)
      ? favorites.filter((id) => id !== body.teamId)
      : [...favorites, body.teamId]

    saveStaticSession({ ...session, favorites: nextFavorites })
    return { favorites: getFavoriteTeams(nextFavorites) }
  }

  throw new Error('API request failed')
}

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  } catch (error) {
    if (BASE_URL !== '/api') {
      throw error
    }

    return staticRequest(path, options)
  }
}

const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
}

export default api
