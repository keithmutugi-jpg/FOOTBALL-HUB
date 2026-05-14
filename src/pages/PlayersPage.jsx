import { useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

function getAge(birthDate) {
  if (!birthDate) return 'N/A'

  const today = new Date()
  const dateOfBirth = new Date(birthDate)
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const hasBirthdayPassed =
    today.getMonth() > dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() && today.getDate() >= dateOfBirth.getDate())

  if (!hasBirthdayPassed) age -= 1

  return age
}

function PlayersPage() {
  const [players, setPlayers] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    api.get('/players').then((data) => setPlayers(data.players || []))
  }, [])

  const filteredPlayers = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return players
    return players.filter((player) =>
      [player.name, player.club, player.position, player.nationality, String(getAge(player.birthDate))].some((field) =>
        String(field || '').toLowerCase().includes(value),
      ),
    )
  }, [players, query])

  return (
    <div className="page-frame">
      <section className="hero-panel compact">
        <div>
          <p className="eyebrow">Player stats</p>
          <h1>Players</h1>
          <p>Search players and review key attacking contributions across clubs.</p>
        </div>
        <div className="search-bar">
          <input
            aria-label="Search players"
            value={query}
            placeholder="Search player, club, nationality, age, or position"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" className="secondary-button" onClick={() => setQuery('')}>
            Clear
          </button>
        </div>
      </section>

      <section className="summary-grid">
        {filteredPlayers.map((player) => (
          <article className="summary-item" key={player.id}>
            <p className="eyebrow">{player.position}</p>
            <h2>{player.name}</h2>
            <dl className="stats-list">
              <div>
                <dt>Club</dt>
                <dd>{player.club}</dd>
              </div>
              <div>
                <dt>Age</dt>
                <dd>{getAge(player.birthDate)}</dd>
              </div>
              <div>
                <dt>Nationality</dt>
                <dd>{player.nationality}</dd>
              </div>
              <div>
                <dt>Position</dt>
                <dd>{player.position}</dd>
              </div>
              <div>
                <dt>Goals</dt>
                <dd>{player.goals}</dd>
              </div>
              <div>
                <dt>Assists</dt>
                <dd>{player.assists}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  )
}

export default PlayersPage
