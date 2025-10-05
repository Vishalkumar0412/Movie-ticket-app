import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'

type User = {
  _id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  profilePicture?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (input: { email: string; password: string }) => Promise<void>
  signup: (input: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/user')
      if (res.data?.success && res.data?.data) setUser(res.data.data)
      else setUser(null)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    (async () => {
      await refresh()
      setLoading(false)
    })()
  }, [refresh])

  const login = useCallback(async (input: { email: string; password: string }) => {
    await api.post('/user/login', input)
    await refresh()
  }, [refresh])

  const signup = useCallback(async (input: { name: string; email: string; password: string }) => {
    await api.post('/user/signup', input)
  }, [])

  const logout = useCallback(async () => {
    await api.post('/user/logout')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, signup, logout, refresh }), [user, loading, login, signup, logout, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


