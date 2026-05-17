import { useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

function StandingsPage() {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/standings').then(setStandings).finally(() => setLoading(false))
  }, [])

  const standingsByLeague = useMemo(() => {
    return standings.reduce((groups, row) => {
      const league = row.league || 'Other'
      return {
        ...groups,
        [league]: [...(groups[league] || []), row],
      }
    }, {})
  }, [standings])

  return (
    <div className="page-frame">
      <section className="hero-panel compact">
        <div>
          <p className="eyebrow">League table</p>
          <h1>Standings</h1>
          <p>Follow club positions, points, wins, draws, and losses from the current league table.</p>
        </div>
      </section>

      {loading ? (
        <p className="status-message">Loading standings…</p>
      ) : (
        Object.entries(standingsByLeague).map(([league, rows]) => (
          <section className="section-card standings-section" key={league}>
            <h2>{league}</h2>
            <div className="table-wrap">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const gd = (row.goalsFor ?? 0) - (row.goalsAgainst ?? 0)
                    const rowClass =
                      row.position <= 4 ? 'row-champions' :
                      row.position >= rows.length - 2 ? 'row-relegation' : ''
                    return (
                      <tr key={row.id} className={rowClass}>
                        <td>{row.position}</td>
                        <td>{row.team}</td>
                        <td>{row.played}</td>
                        <td>{row.won}</td>
                        <td>{row.draw}</td>
                        <td>{row.lost}</td>
                        <td>{row.goalsFor != null ? (gd > 0 ? `+${gd}` : gd) : '—'}</td>
                        <td><strong>{row.points}</strong></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </div>
  )
}

export default StandingsPage
