import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider.jsx'

function LoginPage() {
  const { user, login, socialLogin, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setLocalError(err?.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider) => {
    setLocalError('')
    setLoading(true)
    try {
      await socialLogin(provider)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setLocalError(err?.message || `Failed to sign in with ${provider}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-frame">
      <section className="section-card form-panel">
        <h1>Login to Football Hub</h1>
        <p>Sign in with a social provider or continue with your email address.</p>

       
       

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in…' : 'Continue with email'}
          </button>
        </form>

        {(localError || error) && (
          <div className="notification">{localError || error}</div>
        )}
      </section>
    </div>
  )
}

export default LoginPage
