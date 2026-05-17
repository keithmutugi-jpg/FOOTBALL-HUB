import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthProvider.jsx'
import Nav from './components/Nav.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MatchesPage from './pages/MatchesPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PlayersPage from './pages/PlayersPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import StandingsPage from './pages/StandingsPage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'
import './App.css'

function ProtectedRoute({ children }) {
  const { user, ready } = useAuth()
  if (!ready) {
    return <div className="page-state">Checking your session...</div>
  }
  return user ? children : <Navigate to="/login" replace />
}

function AppShell() {
  return (
    <div className="app-shell">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  const basename = import.meta.env.PROD ? '/FOOTBALL-HUB' : '/'
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}