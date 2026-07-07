import { createContext, useContext, useState, useEffect } from 'react'

/* ─── Change this password to secure your admin panel ─── */
const ADMIN_PASSWORD = 'admin123'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ba_admin_auth')
      if (stored === 'true') setIsAuthenticated(true)
    } catch {}
    setLoading(false)
  }, [])

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('ba_admin_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('ba_admin_auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
