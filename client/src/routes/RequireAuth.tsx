import Login from '@/pages/Login'
import { useAuth } from '@/context/AuthContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-4">Loading...</div>
  if (!user) return <Login />
  return children
}


