import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomePage from '../pages/HomePage.jsx'
import { AuthProvider } from '../components/AuthProvider.jsx'

vi.mock('../api/client.js', () => ({
  default: {
    get: vi.fn((path) => {
      if (path === '/session') {
        return Promise.resolve({ user: null })
      }
      if (path === '/matches') {
        return Promise.resolve([
          { id: 'match-1', home: 'Liverpool', away: 'Manchester City', scoreHome: 2, scoreAway: 1, status: 'Live', kickoff: "72'", league: 'Premier League' },
        ])
      }
      if (path === '/standings') {
        return Promise.resolve([
          { id: 'team-1', position: 1, team: 'Manchester City', points: 68 },
        ])
      }
      if (path === '/teams') {
        return Promise.resolve([
          { id: 'team-1', name: 'Manchester City', shortName: 'Man City', stadium: 'Etihad', founded: 1880 },
        ])
      }
      return Promise.resolve([])
    }),
  },
}))

describe('HomePage', () => {
  it('renders match highlights and a team card', async () => {
    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByText('Live match highlights')).toBeInTheDocument())
    expect(screen.getByText('Liverpool')).toBeInTheDocument()
    expect(screen.getAllByText('Manchester City')[0]).toBeInTheDocument()
  })
})
