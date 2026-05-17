import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PlayersPage from '../pages/PlayersPage.jsx'

vi.mock('../api/client.js', () => ({
  default: {
    get: vi.fn((path) => {
      if (path === '/players') {
        return Promise.resolve({
          players: [
            {
              id: 'player-1',
              name: 'Kevin De Bruyne',
              birthDate: '1991-06-28',
              club: 'Manchester City',
              nationality: 'Belgium',
              position: 'Midfield',
              goals: 10,
              assists: 18,
            },
            {
              id: 'player-2',
              name: 'Erling Haaland',
              birthDate: '2000-07-21',
              club: 'Manchester City',
              nationality: 'Norway',
              position: 'Striker',
              goals: 36,
              assists: 9,
            },
          ],
        })
      }
      return Promise.resolve({ players: [] })
    }),
  },
}))

describe('PlayersPage', () => {
  it('loads and displays player cards', async () => {
    render(<PlayersPage />)

    await waitFor(() => expect(screen.getByText('Kevin De Bruyne')).toBeInTheDocument())
    expect(screen.getByText('Erling Haaland')).toBeInTheDocument()
    expect(screen.getAllByText('Manchester City').length).toBeGreaterThan(1)
  })
})
