import { createContext, useContext, useState, useCallback } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)

// Reads whatever we saved from a previous session so a page refresh
// doesn't log the user out.
function loadStoredUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(loadStoredUser)
  const [role, setRole] = useState(() => localStorage.getItem('role'))

  const persist = (nextToken, nextRole, nextUser) => {
    localStorage.setItem('token', nextToken)
    localStorage.setItem('role', nextRole)
    localStorage.setItem('user', JSON.stringify(nextUser))
    setToken(nextToken)
    setRole(nextRole)
    setUser(nextUser)
  }

  // Both login and signup end with the same shape coming back from the
  // API ({ token, role, user }), so one helper handles either call.
  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    persist(data.token, data.role, data.user)
    return data.role
  }, [])

  const signup = useCallback(async (name, email, password) => {
    const data = await api.signup(name, email, password)
    persist(data.token, data.role, data.user)
    return data.role
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    setToken(null)
    setRole(null)
    setUser(null)
  }, [])

  const value = {
    user,
    role,
    token,
    isAuthenticated: Boolean(token),
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
