import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react'
import { api } from '../services/api'

interface User {
  _id: string
  email: string
  name?: string
}

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthState>({
  token: null,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const verifyToken = useCallback(async (t: string) => {
    console.log('[Auth] Verifying token...')
    try {
      api.setToken(t)
      const result = await api.verifyToken(t)
      console.log('[Auth] Token verified, user:', result.user?.email || result.user)
      setUser(result.user)
      setToken(t)
    } catch (err) {
      console.error('[Auth] Token verification failed:', err)
      setToken(null)
      setUser(null)
      api.setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('cs_token')
    if (stored) {
      console.log('[Auth] Found stored token, verifying...')
      verifyToken(stored)
    } else {
      console.log('[Auth] No stored token found')
      setLoading(false)
    }
  }, [verifyToken])

  useEffect(() => {
    const unsubscribe = window.electronAPI.auth.onToken((incomingToken: string) => {
      console.log('[Auth] Received token from main process')
      localStorage.setItem('cs_token', incomingToken)
      verifyToken(incomingToken)
    })
    return unsubscribe
  }, [verifyToken])

  const login = useCallback(() => {
    console.log('[Auth] Opening login in browser')
    window.electronAPI.auth.openLoginInBrowser(import.meta.env.RENDERER_VITE_WEB_URL)
  }, [])

  const logout = useCallback(() => {
    console.log('[Auth] Logging out')
    localStorage.removeItem('cs_token')
    setToken(null)
    setUser(null)
    api.setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
