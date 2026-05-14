import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider.jsx'

function LoginPage() {
  const { user, login, socialLogin, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const result = await login({ email, password: 'password' })
    setLoading(false)

    if (result) {
      navigate('/dashboard', { replace: true })
    }
  }

  const handleSocial = async (provider) => {
    setLoading(true)
    const result = await socialLogin(provider)
    setLoading(false)
    if (result) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="page-frame">
      <section className="section-card form-panel">
        <h1>Login to Football Hub</h1>
        <p>Sign in with a social provider or continue with your email address.</p>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => handleSocial('google')}>
            Continue with Google
          </button>
          <button type="button" className="secondary-button" onClick={() => handleSocial('github')}>
            Continue with GitHub
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in…' : 'Continue with email'}
          </button>
        </form>

        {error && <div className="notification">{error}</div>}
      </section>
    </div>
  )
}

export default LoginPage
