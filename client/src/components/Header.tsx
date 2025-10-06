import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/loading"
import { toast } from "sonner"

const Header = () => {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const onLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      window.location.href = '/login'
    } catch {
      toast.error('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            🎬 <span className="hidden sm:inline">Movie Tickets</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user && user.role !== 'ADMIN' && (
              <Link 
              to="/movies" 
              className={`hover:text-blue-600 transition-colors ${
                isActive('/movies') ? 'text-blue-600 font-medium' : 'text-gray-600'
              }`}
              >
              Movies
              </Link>
            )}
            
            {user?.role === 'ADMIN' ? (
              <>
                <Link 
                  to="/admin" 
                  className={`font-medium hover:text-blue-600 transition-colors ${
                    isActive('/admin') ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/add-movie"
                  className={`hover:text-blue-600 transition-colors ${
                    isActive('/admin/add-movie') ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  Add Movie
                </Link>
                <Link 
                  to="/admin/add-show"
                  className={`hover:text-blue-600 transition-colors ${
                    isActive('/admin/add-show') ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  Add Showtime
                </Link>
              </>
            ) : (
             ( user && user.role === 'USER') && <Link 
                to="/my-bookings"
                className={`hover:text-blue-600 transition-colors ${
                  isActive('/my-bookings') ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                My Bookings
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l">
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${
                    isActive('/profile') ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {user.role === 'ADMIN' && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      ADMIN
                    </span>
                  )}
                  <span className="text-sm">{user.name}</span>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2"
                >
                  {isLoggingOut && <Spinner size="sm" />}
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <Link 
              to="/movies"
              className="block py-2 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            
            {user?.role === 'ADMIN' ? (
              <>
                <Link 
                  to="/admin"
                  className="block py-2 text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link 
                  to="/admin/add-movie"
                  className="block py-2 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Movie
                </Link>
                <Link 
                  to="/admin/add-show"
                  className="block py-2 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Showtime
                </Link>
              </>
            ) : (
              <Link 
                to="/my-bookings"
                className="block py-2 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}

            {user ? (
              <div className="pt-4 border-t space-y-3">
                <Link 
                  to="/profile"
                  className="block py-2 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    {user.role === 'ADMIN' && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                        ADMIN
                      </span>
                    )}
                    {user.name}
                  </div>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isLoggingOut && <Spinner size="sm" />}
                  Logout
                </Button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="default" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
