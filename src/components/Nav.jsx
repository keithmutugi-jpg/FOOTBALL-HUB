import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LogIn, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from './AuthProvider.jsx'

function Nav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <Link to="/" className="nav-link" onClick={() => setOpen(false)}>
          <span>Football Hub</span>
        </Link>
      </div>
      <button
        type="button"
        className="nav-hamburger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`nav-links${open ? ' nav-links-open' : ''}`}>
        {[['/', 'Home'], ['/matches', 'Matches'], ['/teams', 'Teams'], ['/standings', 'Standings'], ['/players', 'Players'], ['/dashboard', 'Dashboard'], ['/profile', 'Profile']].map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className="nav-link" onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
      </div>
      <div className="nav-actions">
        {user ? (
          <button type="button" className="nav-button" onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        ) : (
          <Link to="/login" className="nav-button" onClick={() => setOpen(false)}>
            <LogIn size={16} />
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Nav
