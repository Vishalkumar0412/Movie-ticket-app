import { useEffect, useState } from 'react'
import type { ApiResponse } from '@/shared/types/apiResponse.type'
import { api } from '@/lib/api'
import { CardsSkeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

type Booking = {
  _id: string
  totalPrice: number
  seats: { seatId: string; seatLabel: string }[]
  showtime: {
    _id: string
    showTime: string
    movie: { title: string; posterUrl: string }
    theater: { name: string; address: string }
  }
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await api.get<ApiResponse<Booking[]>>('/booking/my')
        if (res.success && res.data) setBookings(res.data)
      } catch (e :any) {
        const msg = e?.response?.data?.message || (e instanceof Error ? e.message : 'Failed to fetch bookings')
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-4"><CardsSkeleton count={4} /></div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!bookings.length) return <div className="p-4">No bookings yet.</div>

  return (
    <div className="p-4 space-y-4">
      {bookings.map(b => (
        <div key={b._id} className="flex gap-4 items-center border rounded p-3">
          <img src={b.showtime.movie.posterUrl} alt={b.showtime.movie.title} className="w-16 h-20 object-cover rounded" />
          <div className="flex-1">
            <div className="font-semibold">{b.showtime.movie.title}</div>
            <div className="text-sm text-gray-600">{b.showtime.theater.name} • {b.showtime.theater.address}</div>
            <div className="text-sm">{new Date(b.showtime.showTime).toLocaleString()}</div>
            <div className="text-sm">Seats: {b.seats.map(s => s.seatLabel).join(', ')}</div>
          </div>
          <div className="font-semibold">₹{b.totalPrice}</div>
        </div>
      ))}
    </div>
  )
}


