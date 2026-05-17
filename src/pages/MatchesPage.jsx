import { useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

function getStatusClass(status) {
  return `status-badge status-${status.toLowerCase()}`
}

function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [filter, setFilter] = useState('all')
  const [leagueFilter, setLeagueFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/matches')
      .then(setMatches)
      .finally(() => setLoading(false))
  }, [])

  const visibleMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesStatus = filter === 'all' || match.status.toLowerCase() === filter
      const matchesLeague = leagueFilter === 'all' || match.league === leagueFilter

      return matchesStatus && matchesLeague
    })
  }, [filter, leagueFilter, matches])

  const leagues = useMemo(() => ['all', ...new Set(matches.map((match) => match.league))], [matches])

  return (
    <div className="page-frame">
      <section className="hero-panel compact">
        <div>
          <p className="eyebrow">Live scores and fixtures</p>
          <h1>Matches</h1>
          <p>Track live football scores, halftime updates, venues, leagues, and upcoming fixtures.</p>
        </div>
        <div className="segmented-control" aria-label="Match filter">
          {['all', 'live', 'ht', 'ft', 'upcoming'].map((option) => (
            <button
              type="button"
              className={filter === option ? 'active' : ''}
              key={option}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <div className="segmented-control" aria-label="Match league filter">
        {leagues.map((league) => (
          <button
            type="button"
            className={leagueFilter === league ? 'active' : ''}
            key={league}
            onClick={() => setLeagueFilter(league)}
          >
            {league}
          </button>
        ))}
      </div>

      <section className="section-card">
        {loading ? (
          <p className="status-message">Loading matches...</p>
        ) : (
        <div className="match-list">
            {visibleMatches.length === 0 ? (
              <div className="empty-state">No matches found for the selected filters.</div>
            ) : (
              visibleMatches.map((match) => (
                <article className="match-item" key={match.id}>
                  <div>
                    <strong>{match.home}</strong>
                    <span className="match-status">{match.venue}</span>
                  </div>
                  <div className="score-block">
                    <strong>{match.score}</strong>
                    <span className={getStatusClass(match.status)}>{match.status} · {match.time}</span>
                  </div>
                  <div>
                    <strong>{match.away}</strong>
                    <span className="match-status">{match.league}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default MatchesPage
