import { Link, NavLink } from 'react-router-dom'
import { LogIn, LogOut } from 'lucide-react'
import { useAuth } from './AuthProvider.jsx'

function Nav() {
  const { user, logout } = useAuth()

  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <Link to="/" className="nav-link">
          <span>Football Hub</span>
        </Link>
      </div>
      <div className="nav-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/matches" className="nav-link">
          Matches
        </NavLink>
        <NavLink to="/teams" className="nav-link">
          Teams
        </NavLink>
        <NavLink to="/standings" className="nav-link">
          Standings
        </NavLink>
        <NavLink to="/players" className="nav-link">
          Players
        </NavLink>
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
      </div>
      <div className="nav-actions">
        {user ? (
          <button type="button" className="nav-button" onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        ) : (
          <Link to="/login" className="nav-button">
            <LogIn size={16} />
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Nav
