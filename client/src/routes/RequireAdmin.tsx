import RequireAuth from './RequireAuth'
import { useAuth } from '@/context/AuthContext'

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return (
    <RequireAuth>
      {user?.role === 'ADMIN' ? children : <div className="p-4">Forbidden</div>}
    </RequireAuth>
  )
}


