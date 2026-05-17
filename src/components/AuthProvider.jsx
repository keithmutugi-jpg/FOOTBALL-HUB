import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    api
      .get('/session')
      .then((data) => {
        if (!active) return
        setUser(data.user || null)
      })
      .catch(() => {
        if (!active) return
        setUser(null)
      })
      .finally(() => {
        if (!active) return
        setReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  const login = async ({ email, password }) => {
    const data = await api.post('/auth/login', { email, password })
    setUser(data.user)
    return data.user
  }

  const socialLogin = async (provider, token) => {
    const data = await api.post('/auth/social', { provider, token })
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);