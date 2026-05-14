import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '../components/AuthProvider.jsx'

vi.mock('../api/client.js', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ user: null })),
    post: vi.fn((path, body) => {
      if (path === '/auth/login') {
        return Promise.resolve({ user: { id: 'user-test', email: body.email, provider: 'local', favorites: [] } })
      }
      if (path === '/auth/social') {
        return Promise.resolve({ user: { id: 'social-user', provider: body.provider, email: `${body.provider}@example.com`, favorites: [] } })
      }
      if (path === '/auth/logout') {
        return Promise.resolve({ success: true })
      }
      return Promise.resolve({})
    }),
  },
}))

describe('AuthProvider', () => {
  it('initializes ready state and performs email login', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => expect(result.current.ready).toBe(true))

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' })
    })

    expect(result.current.user).toMatchObject({ email: 'test@example.com' })
  })

  it('supports social login', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => expect(result.current.ready).toBe(true))

    await act(async () => {
      await result.current.socialLogin('google')
    })

    expect(result.current.user).toMatchObject({ provider: 'google' })
  })
})
