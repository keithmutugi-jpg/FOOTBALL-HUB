import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider.jsx'
import { useGoogleLogin } from '@react-oauth/google'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [socialLoading, setSocialLoading] = useState('')
  const { user, login, socialLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Enter both email and password to continue.')
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Unable to sign in. Please check your credentials and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider, token) => {
    setError('')
    setSocialLoading(provider)

    try {
      await socialLogin(provider, token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || `Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setSocialLoading('')
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await handleSocialLogin('google', tokenResponse.access_token)
    },
    onError: () => {
      setError('Google sign in failed. Please try again.')
    },
  })

  const isBusy = isSubmitting || socialLoading

  return (
    <div style={{ backgroundColor: '#05140b', minHeight: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#0b2214', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid #143520' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Welcome back</h1>
        <p style={{ color: '#88a090', marginBottom: '1.75rem' }}>Sign in quickly and access stats, favorites, and the latest match updates.</p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              if (!googleClientId) {
                setError('Google login is not configured yet.')
                return
              }
              googleLogin()
            }}
            disabled={isBusy || !googleClientId}
            style={{
              flex: '1 1 160px',
              padding: '0.85rem',
              background: googleClientId ? '#4285F4' : '#2b3a55',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              cursor: isBusy || !googleClientId ? 'not-allowed' : 'pointer',
              opacity: isBusy || !googleClientId ? 0.7 : 1,
            }}
          >
            {socialLoading === 'google' ? 'Signing in with Google…' : 'Continue with Google'}
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={isBusy}
            style={{
              flex: '1 1 160px',
              padding: '0.85rem',
              background: '#24292F',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              cursor: isBusy ? 'not-allowed' : 'pointer',
              opacity: isBusy ? 0.7 : 1,
            }}
          >
            {socialLoading === 'github' ? 'Signing in with GitHub…' : 'Continue with GitHub'}
          </button>
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <hr style={{ flex: 1, borderColor: '#143520' }} />
          <span style={{ fontSize: '0.85rem', color: '#71867b' }}>or</span>
          <hr style={{ flex: 1, borderColor: '#143520' }} />
        </div>

        {error && (
          <p role="alert" aria-live="polite" style={{ color: '#ff7b7b', fontSize: '0.95rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleEmailLogin}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isBusy}
              style={{ width: '100%', padding: '0.85rem', background: '#05140b', border: '1px solid #143520', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isBusy}
              style={{ width: '100%', padding: '0.85rem', background: '#05140b', border: '1px solid #143520', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontWeight: 'bold',
              cursor: isBusy ? 'not-allowed' : 'pointer',
              opacity: isBusy ? 0.7 : 1,
              fontSize: '1rem',
            }}
          >
            {isSubmitting ? 'Signing in…' : 'Continue with email'}
          </button>
        </form>

        <p style={{ color: '#688b7d', fontSize: '0.88rem', marginTop: '1rem' }}>
          Use your email, Google or GitHub account. No account creation is needed for this demo.
        </p>
      </div>
    </div>
  )
}
