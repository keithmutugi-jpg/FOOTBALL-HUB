import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage.jsx'

const loginMock = vi.fn(() => Promise.resolve({ id: 'user-test' }))
const socialLoginMock = vi.fn(() => Promise.resolve({ id: 'social-user' }))

vi.mock('../components/AuthProvider.jsx', () => ({
  useAuth: () => ({
    user: null,
    login: loginMock,
    socialLogin: socialLoginMock,
  }),
}))

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn(() => vi.fn()),
}))

describe('LoginPage', () => {
  it('renders the login form and calls login when submitted', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continue with email/i }))

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' }))
  })
})
