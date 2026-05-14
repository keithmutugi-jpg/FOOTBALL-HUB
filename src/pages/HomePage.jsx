import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../components/AuthProvider.jsx'
import api from '../api/client.js'

const stadiumImage =
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80'

function getStatusClass(status) {
  return `status-badge status-${status.toLowerCase()}`
}

function HomePage() {
  const [matches, setMatches] = useState([])
  const [standings, setStandings] = useState([])
  const [teams, setTeams] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [matchesData, standingsData, teamsData] = await Promise.all([
          api.get('/matches'),
          api.get('/standings'),
          api.get('/teams'),
        ])

        setMatches(matchesData || [])
        setStandings(standingsData || [])
        setTeams(teamsData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredTeams = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return teams
    return teams.filter((team) =>
      [team.name, team.shortName, team.league].some((field) => String(field || '').toLowerCase().includes(normalized)),
    )
  }, [search, teams])

  const featuredStandings = useMemo(() => standings.slice(0, 12), [standings])

  return (
    <div className="page-frame">
      <section className="section-card home-hero">
        <div>
          <p className="pill">Live football updates</p>
          <h1>Football Hub: your football data home.</h1>
          <p>
            Follow live scores, fixtures, standings, and player statistics from a single, clean
            interface.
          </p>
          <div className="hero-badges">
            <span className="pill">Real-time data</span>
            <span className="pill">Responsive design</span>
            <span className="pill">Server persistence</span>
          </div>
          <div className="action-row">
            <a href="/login" className="primary-button">
              Sign in to personalize
            </a>
            <a href="/dashboard" className="outline-button">
              View dashboard
            </a>
          </div>
        </div>
        <div className="feature-panel">
          <img className="hero-image" src={stadiumImage} alt="Football stadium" />
          <h2>Live match highlights</h2>
          {loading ? (
            <p className="status-message">Loading live scores…</p>
          ) : (
            matches.slice(0, 3).map((match) => (
              <div className="match-item" key={match.id}>
                <div>
                  <strong>{match.home}</strong>
                  <span className="match-status">{match.time}</span>
                </div>
                <div className="score-block">
                  <strong>{match.score}</strong>
                  <div className={getStatusClass(match.status)}>{match.status}</div>
                </div>
                <div>
                  <strong>{match.away}</strong>
                  <span className="match-status">{match.league}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section-card">
        <div className="action-row">
          <h2>Find a team</h2>
          <div className="search-bar">
            <input
              value={search}
              placeholder="Search teams or leagues"
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" className="secondary-button" onClick={() => setSearch('')}>
              Clear
            </button>
          </div>
        </div>
        <div className="summary-grid">
          {!loading && filteredTeams.length ? (
            filteredTeams.slice(0, 12).map((team) => (
              <div className="summary-item" key={team.id}>
                <h3>{team.name}</h3>
                <p>{team.league}</p>
                <p>
                  <strong>Stadium:</strong> {team.stadium}
                </p>
                <p>
                  <strong>Founded:</strong> {team.founded}
                </p>
              </div>
            ))
          ) : (
            <div className="empty-state">
              {search ? 'No teams matched your search.' : 'No team details are available yet.'}
            </div>
          )}
        </div>
      </section>

      <section className="section-card">
        <h2>League standings</h2>
        {loading ? (
          <p className="status-message">Loading standings…</p>
        ) : (
          <table className="standings-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {featuredStandings.map((row) => (
                <tr className="standings-row" key={row.id}>
                  <td>{row.position}</td>
                  <td>{row.team} · {row.league}</td>
                  <td>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer className="page-footer">
          {user
            ? `Welcome back, ${user.name || user.email}!`
            : 'Login to save your favorite teams and get a personalized feed.'}
      </footer>
    </div>
  )
}

export default HomePage
