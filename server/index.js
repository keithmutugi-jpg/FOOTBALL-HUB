import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFile, writeFile } from 'fs/promises'
import 'dotenv/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'data', 'db.json')
const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: [
    'https://keithmutugi-jpg.github.io',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

async function readDb() {
  const raw = await readFile(dbPath, 'utf-8')
  return JSON.parse(raw)
}

async function writeDb(data) {
  await writeFile(dbPath, JSON.stringify(data, null, 2))
}

function sendJson(res, payload) {
  return res.json(payload)
}

function buildUser(provider, email) {
  if (provider === 'github') {
    return {
      id: 'github-1',
      name: 'Football Fan',
      email: email || 'fan@github.com',
      provider: 'github',
      avatar: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=256&q=80',
    }
  }
}

async function getSession(req) {
  const token = req.cookies.session_token
  if (!token) {
    return null
  }
  const db = await readDb()
  return db.sessions?.[token] || null
}

async function saveSession(res, user) {
  const db = await readDb()
  const token = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const session = {
    user,
    favorites: user.favorites || [],
    createdAt: new Date().toISOString(),
  }
  db.sessions = db.sessions || {}
  db.sessions[token] = session
  await writeDb(db)
  res.cookie('session_token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'none',
    secure: true,
  })
  return session
}

app.get('/api/session', async (req, res) => {
  const session = await getSession(req)
  const user = session ? { ...session.user, favorites: session.favorites || [] } : null
  return sendJson(res, { user })
})

app.get('/api/profile', async (req, res) => {
  const session = await getSession(req)
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  const user = { ...session.user, favorites: session.favorites || [] }
  return sendJson(res, { user })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }
  const user = {
    id: `user-${email}`,
    name: email.split('@')[0],
    email,
    provider: 'local',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  }
  const session = await saveSession(res, user)
  return sendJson(res, { user: { ...session.user, favorites: session.favorites } })
})

app.post('/api/auth/social', async (req, res) => {
  const { provider, token } = req.body

  if (!provider || !['github', 'google'].includes(provider)) {
    return res.status(400).json({ message: 'Invalid social provider.' })
  }

  if (provider === 'google') {
    try {
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!googleRes.ok) {
        return res.status(401).json({ message: 'Invalid Google token.' })
      }
      const profile = await googleRes.json()
      const user = {
        id: `google-${profile.sub}`,
        name: profile.name,
        email: profile.email,
        provider: 'google',
        avatar: profile.picture,
      }
      const session = await saveSession(res, user)
      return sendJson(res, { user: { ...session.user, favorites: session.favorites } })
    } catch {
      return res.status(500).json({ message: 'Google authentication failed.' })
    }
  }

  const user = buildUser(provider)
  const session = await saveSession(res, user)
  return sendJson(res, { user: { ...session.user, favorites: session.favorites } })
})

app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies.session_token
  if (token) {
    const db = await readDb()
    delete db.sessions?.[token]
    await writeDb(db)
  }
  res.clearCookie('session_token')
  return sendJson(res, { success: true })
})

app.get('/api/matches', async (req, res) => {
  const db = await readDb()
  const limit = Number(req.query.limit || db.matches.length)
  return sendJson(res, db.matches.slice(0, limit))
})

app.get('/api/standings', async (req, res) => {
  const db = await readDb()
  const limit = Number(req.query.limit || db.standings.length)
  return sendJson(res, db.standings.slice(0, limit))
})

app.get('/api/teams', async (req, res) => {
  const db = await readDb()
  return sendJson(res, db.teams)
})

app.get('/api/players', async (req, res) => {
  const db = await readDb()
  return sendJson(res, { players: db.players })
})

app.get('/api/favorites', async (req, res) => {
  const session = await getSession(req)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const db = await readDb()
  const favorites = session.favorites.map((id) => db.teams.find((team) => team.id === id)).filter(Boolean)
  return sendJson(res, { favorites })
})

app.patch('/api/favorites', async (req, res) => {
  const { teamId } = req.body
  if (!teamId) {
    return res.status(400).json({ message: 'Team id required.' })
  }
  const token = req.cookies.session_token
  const db = await readDb()
  const session = db.sessions?.[token]
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const existing = session.favorites || []
  if (existing.includes(teamId)) {
    session.favorites = existing.filter((id) => id !== teamId)
  } else {
    session.favorites = [...existing, teamId]
  }
  db.sessions[token] = session
  await writeDb(db)
  const favorites = session.favorites.map((id) => db.teams.find((team) => team.id === id)).filter(Boolean)
  return sendJson(res, { favorites })
})

app.use(express.static(path.join(__dirname, '..', 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`Football Hub API listening on http://localhost:${port}`)
})