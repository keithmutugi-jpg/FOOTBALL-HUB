import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TeamsPage from '../pages/TeamsPage.jsx'

vi.mock('../api/client.js', () => ({
  default: {
    get: vi.fn((path) => {
      if (path === '/teams') {
        return Promise.resolve([
          {
            id: 'team-1',
            name: 'Manchester City',
            shortName: 'Man City',
            league: 'Premier League',
            stadium: 'Etihad Stadium',
            founded: 1880,
            summary: 'Manchester City compete in Premier League and are part of the Football Hub club directory.',
          },
        ])
      }
      return Promise.resolve([])
    }),
  },
}))

describe('TeamsPage', () => {
  it('shows team cards after loading', async () => {
    render(<TeamsPage />)

    await waitFor(() => expect(screen.getByRole('heading', { name: /Manchester City/i })).toBeInTheDocument())
    expect(screen.getByText('Etihad Stadium')).toBeInTheDocument()
    expect(screen.getAllByText('Premier League').length).toBeGreaterThan(0)
  })
})
