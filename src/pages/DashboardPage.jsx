import { useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'
import { useAuth } from '../components/AuthProvider.jsx'

function getStatusClass(status) {
  return `status-badge status-${status.toLowerCase()}`
}

function DashboardPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const [teamsData, matchesData, favoritesData] = await Promise.all([
          api.get('/teams'),
          api.get('/matches'),
          api.get('/favorites').catch(() => ({ favorites: [] })),
        ])

        setTeams(teamsData)
        setMatches(matchesData)
        setFavorites(favoritesData.favorites || [])
      } catch {
        setError('Unable to load dashboard data. Start the API server and try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const favoriteTeamIds = useMemo(() => favorites.map((team) => team.id), [favorites])
  const favoriteTeams = teams.filter((team) => favoriteTeamIds.includes(team.id))
  const liveMatches = matches.filter((match) => ['Live', 'HT'].includes(match.status))

  async function toggleFavorite(teamId) {
    const updated = await api.patch('/favorites', { teamId })
    setFavorites(updated.favorites)
  }

  return (
    <div className="page-frame">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Personal dashboard</p>
          <h1>Welcome back, {user?.name || user?.email}</h1>
          <p>
            Your saved clubs are persisted on the server through an authenticated session cookie, so the
            app does not depend on browser local storage.
          </p>
        </div>
        <div className="metric-strip">
          <span>{favoriteTeams.length} favorites</span>
          <span>{liveMatches.length} live games</span>
          <span>{teams.length} teams</span>
        </div>
      </section>

      {error && <div className="notification">{error}</div>}

      <section className="section-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Favorites</p>
            <h2>Your saved clubs</h2>
          </div>
        </div>
        {loading ? (
          <p className="status-message">Loading teams...</p>
        ) : favoriteTeams.length ? (
          <div className="summary-grid">
            {favoriteTeams.map((team) => (
              <article className="summary-item" key={team.id}>
                <h3>{team.name}</h3>
                <p>{team.stadium}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">No saved favorites yet. Add a favorite team below.</div>
        )}
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Teams</p>
            <h2>Browse clubs</h2>
          </div>
        </div>
        <div className="summary-grid">
          {teams.map((team) => (
            <article className="summary-item" key={team.id}>
              <h3>{team.name}</h3>
              <p>{team.summary}</p>
              <button type="button" className="secondary-button" onClick={() => toggleFavorite(team.id)}>
                {favoriteTeamIds.includes(team.id) ? 'Remove favorite' : 'Save favorite'}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fixtures</p>
            <h2>Latest matches</h2>
          </div>
        </div>
        <div className="match-list">
          {matches.slice(0, 4).map((match) => (
            <article className="match-item" key={match.id}>
              <div>
                <strong>{match.home}</strong>
                <span className="match-status">{match.venue}</span>
              </div>
              <div className="score-block">
                <strong>{match.score}</strong>
                <span className={getStatusClass(match.status)}>{match.status}</span>
              </div>
              <div>
                <strong>{match.away}</strong>
                <span className="match-status">{match.league}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
