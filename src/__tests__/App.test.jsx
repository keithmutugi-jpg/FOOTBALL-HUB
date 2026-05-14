import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'
import { AuthProvider } from '../components/AuthProvider.jsx'

vi.mock('../api/client.js', () => ({
  default: {
    get: vi.fn((path) => {
      if (path === '/session') {
        return Promise.resolve({ user: null })
      }
      return Promise.resolve([])
    }),
    post: vi.fn(() => Promise.resolve({ user: null })),
  },
}))

describe('App shell', () => {
  it('renders navigation and homepage content', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>,
    )

    expect(screen.getByText('Football Hub')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
