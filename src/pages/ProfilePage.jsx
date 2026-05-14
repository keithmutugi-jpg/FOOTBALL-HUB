import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider.jsx'
import api from '../api/client.js'

function ProfilePage() {
  const { user, logout } = useAuth()
  const [favorites, setFavorites] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/favorites')
      .then((data) => setFavorites(data.favorites || []))
      .catch(() => setFavorites([]))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page-frame">
      <section className="section-card">
        <h1>Profile</h1>
        <div className="profile-field">
          <strong>Name</strong>
          <p>{user?.name || 'Guest'}</p>
        </div>
        <div className="profile-field">
          <strong>Email</strong>
          <p>{user?.email || 'Not signed in'}</p>
        </div>
        <div className="profile-field">
          <strong>Login method</strong>
          <p>{user?.provider || 'Guest'}</p>
        </div>
        <div className="profile-field">
          <strong>Saved favorites</strong>
          <p>{favorites.length ? favorites.map((team) => team.name).join(', ') : 'None yet'}</p>
        </div>
        <button type="button" className="primary-button" onClick={handleLogout}>
          Sign out
        </button>
      </section>
    </div>
  )
}

export default ProfilePage
