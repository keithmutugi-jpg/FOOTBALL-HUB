import { useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

function StandingsPage() {
  const [standings, setStandings] = useState([])

  useEffect(() => {
    api.get('/standings').then(setStandings)
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

      {Object.entries(standingsByLeague).map(([league, rows]) => (
        <section className="section-card standings-section" key={league}>
          <h2>{league}</h2>
          <div className="table-wrap">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Team</th>
                  <th>Played</th>
                  <th>Won</th>
                  <th>Draw</th>
                  <th>Lost</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.position}</td>
                    <td>{row.team}</td>
                    <td>{row.played}</td>
                    <td>{row.won}</td>
                    <td>{row.draw}</td>
                    <td>{row.lost}</td>
                    <td>
                      <strong>{row.points}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}

export default StandingsPage
