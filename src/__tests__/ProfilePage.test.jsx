import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from '../pages/ProfilePage.jsx'

const logoutMock = vi.fn(() => Promise.resolve())

vi.mock('../components/AuthProvider.jsx', () => ({
  useAuth: () => ({
    user: {
      name: 'Test User',
      email: 'test@example.com',
      provider: 'google',
    },
    logout: logoutMock,
  }),
}))

vi.mock('../api/client.js', () => ({
  default: {
    get: vi.fn((path) => {
      if (path === '/favorites') {
        return Promise.resolve({ favorites: [{ id: 'team-1', name: 'Arsenal' }] })
      }
      return Promise.resolve({})
    }),
  },
}))

describe('ProfilePage', () => {
  it('renders profile data and favorite teams', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument())
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('google')).toBeInTheDocument()
    expect(await screen.findByText('Arsenal')).toBeInTheDocument()
  })

  it('calls logout when sign out is clicked', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(logoutMock).toHaveBeenCalled()
  })
})
