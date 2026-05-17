import { useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [query, setQuery] = useState('')
  const [leagueFilter, setLeagueFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teams').then(setTeams).finally(() => setLoading(false))
  }, [])

  const filteredTeams = useMemo(() => {
    const value = query.trim().toLowerCase()
    return teams.filter((team) => {
      const matchesLeague = leagueFilter === 'all' || team.league === leagueFilter
      const matchesSearch =
        !value ||
        [team.name, team.shortName, team.stadium, team.league].some((field) =>
          String(field || '').toLowerCase().includes(value),
        )

      return matchesLeague && matchesSearch
    })
  }, [leagueFilter, query, teams])

  const leagues = useMemo(() => ['all', ...new Set(teams.map((team) => team.league))], [teams])

  return (
    <div className="page-frame">
      <section className="hero-panel compact">
        <div>
          <p className="eyebrow">Club directory</p>
          <h1>Teams</h1>
          <p>Search clubs, compare stadium details, and review short team summaries.</p>
        </div>
        <div className="search-bar">
          <input
            aria-label="Search teams"
            value={query}
            placeholder="Search team, league, or stadium"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" className="secondary-button" onClick={() => setQuery('')}>
            Clear
          </button>
        </div>
      </section>

      <div className="segmented-control" aria-label="Team league filter">
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

      <section className="summary-grid">
        {loading ? (
          <p className="status-message">Loading teams…</p>
        ) : filteredTeams.length === 0 ? (
          <div className="empty-state">No teams matched your search.</div>
        ) : (
          filteredTeams.map((team) => (
            <article className="summary-item" key={team.id}>
              <p className="eyebrow">{team.league}</p>
              <h2>{team.name}</h2>
              <p>{team.summary}</p>
              <dl className="stats-list">
                <div>
                  <dt>Stadium</dt>
                  <dd>{team.stadium}</dd>
                </div>
                <div>
                  <dt>Founded</dt>
                  <dd>{team.founded}</dd>
                </div>
              </dl>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

export default TeamsPage
