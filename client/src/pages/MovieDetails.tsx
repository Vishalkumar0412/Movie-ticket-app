import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import type { ApiResponse } from '@/shared/types/apiResponse.type'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type ShowSeat = { _id: string; seatLabel: string; isBooked: boolean }
type ShowTime = {
  _id: string
  showTime: string
  seats: ShowSeat[]
  movie: { _id: string; title: string; posterUrl: string; genre: string; description: string }
  theater: { _id: string; name: string; address: string }
}

export default function MovieDetails() {
  const { movieId } = useParams()
  const [shows, setShows] = useState<ShowTime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedShow, setSelectedShow] = useState<string | null>(null)
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([])
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)

  

  useEffect(() => {
    if (!movieId) return
    ;(async () => {
      try {
        const { data: res } = await api.get<ApiResponse<ShowTime[]>>(`/movie/check-shows/${movieId}`)
        if (res.success && res.data) setShows(res.data)
      } catch (e: any) {
        const msg = e?.response?.data?.message || (e instanceof Error ? e.message : 'Failed to fetch showtimes')
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    })()
  }, [movieId])

  const currentShow = useMemo(() => shows.find(s => s._id === selectedShow) ?? shows[0], [shows, selectedShow])

  const groupedShowsByDate = useMemo(() => {
    return shows.reduce((acc, show) => {
      const date = format(new Date(show.showTime), 'yyyy-MM-dd')
      if (!acc[date]) acc[date] = []
      acc[date].push(show)
      return acc
    }, {} as Record<string, ShowTime[]>)
  }, [shows])

  useEffect(() => {
    if (shows.length && !selectedShow) setSelectedShow(shows[0]._id)
  }, [shows, selectedShow])

  const toggleSeat = (seatId: string, isBooked: boolean) => {
    if (isBooked) return
    setSelectedSeatIds(prev => prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId])
  }

  const bookSeats = async () => {
    if (!currentShow || selectedSeatIds.length === 0) return
    setBookingError(null)
    setBookingLoading(true)
    try {
      const { data: res } = await api.post<ApiResponse<any>>('/booking/book-seat', { showId: currentShow._id, seatIds: selectedSeatIds })
      if (res.success) {
        const { data: refreshed } = await api.get<ApiResponse<ShowTime[]>>(`/movie/check-shows/${movieId}`)
        if (refreshed.success && refreshed.data) setShows(refreshed.data)
        setSelectedSeatIds([])
        toast.success('Booking confirmed')
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || (e instanceof Error ? e.message : 'Booking failed')
      setBookingError(msg)
      toast.error(msg)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <div className="p-4 space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-32 w-24" /><Skeleton className="h-24 w-1/2" /></div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!currentShow) return <div className="p-4">No showtimes available.</div>

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="overflow-hidden">
        <div className="md:flex">
          {/* Movie Poster */}
          <div className="md:w-1/3 relative">
            <img 
              src={currentShow.movie.posterUrl} 
              alt={currentShow.movie.title} 
              className="w-full  aspect-square object-cover" 
            />
          </div>

          {/* Movie Details */}
          <div className="p-6 md:w-2/3 space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{currentShow.movie.title}</h1>
              <p className="text-sm font-medium mt-1 inline-block px-2 py-1 bg-gray-100 rounded-full">
                {currentShow.movie.genre}
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">{currentShow.movie.description}</p>
            
            <Separator className="my-4" />
            
            {/* Theater Info */}
            <div>
              <h3 className="font-semibold mb-2">Theater Information</h3>
              <p className="text-gray-600">{currentShow.theater.name}</p>
              <p className="text-sm text-gray-500">{currentShow.theater.address}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Showtimes Section */}
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Select Showtime</h2>
          <ScrollArea className="w-full">
            <div className="space-y-4">
              {Object.entries(groupedShowsByDate).map(([date, dateShows]) => (
                <div key={date} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {dateShows.map(s => (
                      <Button
                        key={s._id}
                        onClick={() => setSelectedShow(s._id)}
                        variant={s._id === currentShow._id ? 'default' : 'outline'}
                        className="transition-all"
                      >
                        {format(new Date(s.showTime), 'h:mm a')}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Seat Selection */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Select Seats</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border"></div>
                Available
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-600"></div>
                Selected
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-300"></div>
                Booked
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg">
            {/* Screen */}
            <div className="relative w-full mb-8">
              <div className="h-2 bg-gray-300 w-3/4 mx-auto rounded-lg"></div>
              <p className="text-center text-sm text-gray-500 mt-2">Screen</p>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {currentShow.seats.map(seat => (
                <button
                  key={seat._id}
                  onClick={() => toggleSeat(seat._id, seat.isBooked)}
                  disabled={seat.isBooked}
                  className={`
                    p-2 text-sm rounded-md border transition-all
                    ${seat.isBooked 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                      : selectedSeatIds.includes(seat._id)
                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                        : 'hover:border-blue-600 hover:text-blue-600'
                    }
                  `}
                  title={seat.seatLabel}
                >
                  {seat.seatLabel}
                </button>
              ))}
            </div>
          </div>

          {bookingError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{bookingError}</div>
          )}

          <div className="flex justify-between items-center border-t pt-4 mt-6">
            <div className="text-sm text-gray-600">
              {selectedSeatIds.length} seat(s) selected
            </div>
            <Button
              onClick={bookSeats}
              disabled={bookingLoading || selectedSeatIds.length === 0}
              className="min-w-[150px]"
            >
              {bookingLoading ? 'Booking...' : `Book Tickets`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}


