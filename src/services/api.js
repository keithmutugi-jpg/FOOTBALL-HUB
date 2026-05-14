const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const ACTIVE_SESSION_ID = 'active'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export async function getFootballData() {
  const [matches, teams, standings, players] = await Promise.all([
    request('/matches'),
    request('/teams'),
    request('/standings'),
    request('/players'),
  ])

  return { matches, teams, standings, players }
}

export async function getSession() {
  const session = await request(`/sessions/${ACTIVE_SESSION_ID}`)

  if (!session.userId) {
    return null
  }

  return request(`/users/${session.userId}`)
}

export async function signInWithProvider(provider) {
  const users = await request(`/users?provider=${provider}`)
  const user = users[0]

  if (!user) {
    throw new Error('No user is configured for this provider')
  }

  await request(`/sessions/${ACTIVE_SESSION_ID}`, {
    method: 'PATCH',
    body: JSON.stringify({ userId: user.id }),
  })

  return user
}

export async function signOut() {
  await request(`/sessions/${ACTIVE_SESSION_ID}`, {
    method: 'PATCH',
    body: JSON.stringify({ userId: null }),
  })
}

export async function updateFavoriteTeams(userId, favoriteTeams) {
  return request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ favoriteTeams }),
  })
}
