import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Home = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Book movie tickets in seconds</h1>
        <p className="text-gray-600">Discover the latest movies, pick your seats, and enjoy the show. Fast, secure, and hassle-free booking.</p>
        <div className="flex gap-3">
          <Link to="/movies"><Button>Browse Movies</Button></Link>
          <Link to="/my-bookings"><Button variant="outline">My Bookings</Button></Link>
        </div>
      </div>
      <div className="hidden md:block">
        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop" alt="Cinema" className="rounded-lg shadow" />
      </div>
    </section>
  )
}

export default Home