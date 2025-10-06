import { useAuth } from '@/context/AuthContext'

export default function RequireUser({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-4">Loading...</div>
  if (!user) return children
  if (user.role === 'ADMIN') {
    window.location.replace('/admin')
    return null
  }
  return children
}